import React, { useState, useEffect } from "react";
import img2 from "../../assets/img3.jpg";
import SidebarToggle from "./SidebarToggle";
import { useApi } from "../../context/ApiContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "../../styles/adminexedetails.css";
import { useLoading } from "../../context/LoadingContext";
import AdminSpinner from "../spinner/AdminSpinner";

const ExecutiveDetails = () => {
  const {
    fetchExecutivesAPI,
    fetchAllManagersAPI,
    fetchAllHRsAPI,
    fetchAllProcessPersonsAPI,
    fetchAllTeamLeadsAPI,
    createManagerTeam,
    fetchAllTeamsAPI,
    managerTeams,
    assignExecutiveToTeam,
    updateUserLoginStatus,
    toggleManagerLoginAccess,
    toggleHrLoginAccess,
    toggleProcessPersonLoginAccess,
    toggleTlLoginAccess,
  } = useApi();
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const { showLoader, hideLoader, isLoading, variant } = useLoading();
  const [recentlyAssigned, setRecentlyAssigned] = useState(null);
  const [cooldownUsers, setCooldownUsers] = useState(new Map());
  const [cooldownTimers, setCooldownTimers] = useState(new Map());
  const [people, setPeople] = useState([]);
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [isTeamLoading, setIsTeamLoading] = useState(false);
  const [teamAssigning, setTeamAssigning] = useState(false);
  const [focusedTeamId, setFocusedTeamId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Drag and Drop States
  const [draggedExecutive, setDraggedExecutive] = useState(null);
  const [dragOverTeam, setDragOverTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState({});

  // Initialize cooldown state from localStorage
  useEffect(() => {
    const savedCooldowns = JSON.parse(localStorage.getItem("cooldownUsers") || "{}");
    const savedTimers = JSON.parse(localStorage.getItem("cooldownTimers") || "{}");
    const now = Date.now();

    const activeCooldowns = new Map();
    const activeTimers = new Map();

    Object.entries(savedCooldowns).forEach(([userId, expiry]) => {
      if (now < expiry) {
        activeCooldowns.set(userId, true);
        const timeLeft = Math.ceil((expiry - now) / 1000);
        activeTimers.set(userId, timeLeft);
      }
    });

    setCooldownUsers(activeCooldowns);
    setCooldownTimers(activeTimers);

    // Start timers for active cooldowns
    activeCooldowns.forEach((_, userId) => {
      startCooldown(userId, activeTimers.get(userId));
    });

    return () => {
      cooldownTimers.forEach((id, key) => {
        if (key.toString().startsWith("interval_")) {
          clearInterval(id);
        }
      });
    };
  }, []);

  const startCooldown = (userId, initialTime = 15) => {
    const cooldownDuration = initialTime; // seconds
    const expiry = Date.now() + cooldownDuration * 1000;

    // Update state
    setCooldownUsers(prev => new Map(prev).set(userId, true));
    setCooldownTimers(prev => new Map(prev).set(userId, cooldownDuration));

    // Save to localStorage
    localStorage.setItem(
      "cooldownUsers",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("cooldownUsers") || "{}"),
        [userId]: expiry,
      })
    );
    localStorage.setItem(
      "cooldownTimers",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("cooldownTimers") || "{}"),
        [userId]: cooldownDuration,
      })
    );

    const intervalId = setInterval(() => {
      setCooldownTimers(prev => {
        const newTimers = new Map(prev);
        const timeLeft = newTimers.get(userId);
        if (timeLeft <= 1) {
          clearInterval(intervalId);
          newTimers.delete(userId);
          setCooldownUsers(p => {
            const copy = new Map(p);
            copy.delete(userId);
            return copy;
          });
          // Clean up localStorage
          const savedCooldowns = JSON.parse(localStorage.getItem("cooldownUsers") || "{}");
          const savedTimers = JSON.parse(localStorage.getItem("cooldownTimers") || "{}");
          delete savedCooldowns[userId];
          delete savedTimers[userId];
          localStorage.setItem("cooldownUsers", JSON.stringify(savedCooldowns));
          localStorage.setItem("cooldownTimers", JSON.stringify(savedTimers));
          return newTimers;
        } else {
          newTimers.set(userId, timeLeft - 1);
          localStorage.setItem(
            "cooldownTimers",
            JSON.stringify({
              ...JSON.parse(localStorage.getItem("cooldownTimers") || "{}"),
              [userId]: timeLeft - 1,
            })
          );
          return newTimers;
        }
      });
    }, 1000);

    setCooldownTimers(prev => new Map(prev).set(`interval_${userId}`, intervalId));
  };

  const handleToggleLoginStatus = async (personId, currentStatus) => {
    if (cooldownUsers.has(personId)) {
      const timeLeft = cooldownTimers.get(personId) || 0;
      showCustomPopup(`Please wait ${timeLeft}s before toggling again`, 'cooldown');
      return;
    }

    const newStatus = !currentStatus;

    try {
      await updateUserLoginStatus(personId, newStatus);
      setPeople(prev =>
        prev.map(p => p.id === personId ? { ...p, canLogin: newStatus } : p)
      );

      showCustomPopup(
        `Login access ${newStatus ? "enabled" : "disabled"} successfully`,
        newStatus ? 'success' : 'warning'
      );

      if (!newStatus) {
        startCooldown(personId);
      }
    } catch (err) {
      console.error(err);
      showCustomPopup("Failed to toggle login access", 'error');
    }
  };

  const handleToggleRoleLoginStatus = async (role, userId, currentStatus) => {
    if (cooldownUsers.has(userId)) {
      toast.warning(`Please wait ${cooldownTimers.get(userId) || 0}s`);
      return;
    }

    const newStatus = !currentStatus;
    const r = role.toLowerCase();

    try {
      if (r === "manager") {
        await toggleManagerLoginAccess(userId, newStatus);
      } else if (r === "hr") {
        await toggleHrLoginAccess(userId, newStatus);
      } else if (r === "tl" || r === "team lead") {
        await toggleTlLoginAccess(userId, newStatus);
      } else if (r === "process" || r.includes("process")) {
        await toggleProcessPersonLoginAccess(userId, newStatus);
      } else {
        toast.error("Unsupported role");
        return;
      }

      setPeople(prev =>
        prev.map(p => p.id === userId ? { ...p, canLogin: newStatus } : p)
      );
      toast.success(`${role} login ${newStatus ? "enabled" : "disabled"}`);
      if (!newStatus) {
        startCooldown(userId);
      }
    } catch (err) {
      console.error(err);
      toast.error("Toggle failed");
    }
  };

  const showCustomPopup = (message, type) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader("Loading data...", "admin");

        let data = [];
        let fetchedTeams = [];

        if (filter === "All") {
          fetchedTeams = await fetchAllTeamsAPI();
          data = await fetchExecutivesAPI();
        } else if (filter === "Manager") {
          data = await fetchAllManagersAPI();
        } else if (filter === "HR") {
          data = await fetchAllHRsAPI();
        } else if (filter === "Process") {
          data = await fetchAllProcessPersonsAPI();
        } else if (filter === "TL") {
          data = await fetchAllTeamLeadsAPI();
        }

        const teamLookup = {};
        (fetchedTeams || []).forEach((t) => {
          teamLookup[t.id] = t.name;
        });

        const mapped = data.map((person) => {
          const teamId = person.team_id || person.teamId || null;
          return {
            id: person.id,
            image: img2,
            name: person.name || person.fullName || person.firstname || person.username || "Unknown",
            profession: person.role || filter || "User",
            technology: person.skills || "Not specified",
            emailId: person.email || "N/A",
            country: person.country || "N/A",
            city: person.city || "N/A",
            canLogin: person.can_login,
            teamId,
            teamName:
              person.teamName ||
              person.team?.name ||
              (teamId ? teamLookup[teamId] : null),
          };
        });

        setPeople(mapped);
        setSelectedMembers([]);
        setSelectedManagers([]);

        if (filter === "Manager") {
          setManagers(mapped);
        }

        if (filter === "All") {
          const teamMembersMap = {};
          mapped.forEach((person) => {
            if (person.teamId) {
              if (!teamMembersMap[person.teamId]) {
                teamMembersMap[person.teamId] = [];
              }
              teamMembersMap[person.teamId].push(person);
            }
          });
          setTeamMembers(teamMembersMap);
        }
      } catch (err) {
        console.error("❌ Error fetching people:", err);
        setPeople([]);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, [filter]);

  useEffect(() => {
    const loadTeamsIfNeeded = async () => {
      if (filter === "All") {
        setIsTeamLoading(true);
        const teams = await fetchAllTeamsAPI();
        setIsTeamLoading(false);
      }
    };
    loadTeamsIfNeeded();
  }, [filter]);

  const handleDragStart = (e, executive) => {
    if (filter !== "All") return;

    setDraggedExecutive(executive);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);

    setTimeout(() => {
      e.target.classList.add("dragging");
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
    setDraggedExecutive(null);
    setDragOverTeam(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, teamId) => {
    e.preventDefault();
    setDragOverTeam(teamId);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverTeam(null);
    }
  };

  const handleDrop = async (e, teamId) => {
    e.preventDefault();
    setDragOverTeam(null);

    if (!draggedExecutive) return;

    if (draggedExecutive.teamId === teamId) {
      toast.info(`${draggedExecutive.name} is already in this team.`);
      return;
    }

    try {
      setTeamAssigning(true);

      const assignedTeam = managerTeams.find(team => team.id === teamId);

      await assignExecutiveToTeam({
        teamId: Number(teamId),
        executiveId: Number(draggedExecutive.id),
        managerId: Number(assignedTeam?.managerId),
      });

      toast.success(`Successfully assigned ${draggedExecutive.name} to the team!`);

      setRecentlyAssigned(draggedExecutive.id);
      setTimeout(() => setRecentlyAssigned(null), 5000);

      setPeople(prevPeople =>
        prevPeople.map(person => {
          if (person.id === draggedExecutive.id) {
            return {
              ...person,
              teamName: assignedTeam ? assignedTeam.name : `Team ${teamId}`,
              teamId: teamId,
            };
          }
          return person;
        })
      );

      setTeamMembers(prev => {
        const updated = { ...prev };

        if (draggedExecutive.teamId) {
          updated[draggedExecutive.teamId] =
            updated[draggedExecutive.teamId]?.filter(
              member => member.id !== draggedExecutive.id
            ) || [];
        }

        if (!updated[teamId]) updated[teamId] = [];
        updated[teamId].push({
          ...draggedExecutive,
          teamName: assignedTeam ? assignedTeam.name : `Team ${teamId}`,
          teamId: teamId,
        });

        return updated;
      });

      const dropZone = e.currentTarget;
      dropZone.classList.add("drop-success");
      setTimeout(() => dropZone.classList.remove("drop-success"), 500);
    } catch (error) {
      toast.error("❌ Failed to assign executive to team.");
      console.error(error);
    } finally {
      setTeamAssigning(false);
      setDraggedExecutive(null);
    }
  };

  const handleMemberSelect = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleManagerSelect = (id) => {
    setSelectedManagers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleAssignTeam = async () => {
    if (!selectedTeam || selectedMembers.length === 0) {
      toast.error("Please select a team and at least one executive.");
      return;
    }

    setTeamAssigning(true);
    try {
      const assignedTeam = managerTeams.find(team => team.id === Number(selectedTeam));

      const responses = await Promise.all(
        selectedMembers.map((executiveId) =>
          assignExecutiveToTeam({
            teamId: Number(selectedTeam),
            executiveId: Number(executiveId),
            managerId: Number(assignedTeam?.managerId),
          })
        )
      );

      setFocusedTeamId(selectedTeam);
      setSelectedMembers([]);
      setSelectedTeam("");

      setPeople((prevPeople) =>
        prevPeople.map((person) => {
          const updated = responses.find((res) => res.user?.id === person.id);
          if (updated) {
            const assignedTeam = managerTeams.find((team) => team.id === updated.user.team_id);
            return {
              ...person,
              teamName: assignedTeam ? assignedTeam.name : `Team ${updated.user.team_id}`,
              teamId: updated.user.team_id,
            };
          }
          return person;
        })
      );

      toast.success(`Assigned ${selectedMembers.length} member(s) to the selected team!`);
      setSelectedMembers([]);
      setSelectedTeam("");
    } catch (error) {
      toast.error("❌ Failed to assign members to the team.");
      console.error(error);
    } finally {
      setTeamAssigning(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      toast.error("Please enter a team name.");
      return;
    }
    if (selectedManagers.length !== 1) {
      toast.error("Please select exactly one Manager to create a team.");
      return;
    }

    const managerId = selectedManagers[0];

    try {
      await createManagerTeam({ name: newTeamName, managerId });
      await fetchAllTeamsAPI();
      toast.success(`Team "${newTeamName}" created successfully!`);
      setNewTeamName("");
      setShowModal(false);
      setSelectedManagers([]);
    } catch (err) {
      toast.error("Error creating team.");
      console.error(err);
    }
  };

  useEffect(() => {
    const scrollOnEdge = (e) => {
      const { clientY } = e;
      const threshold = 100;
      const scrollSpeed = 10;

      if (clientY < threshold) {
        window.scrollBy(0, -scrollSpeed);
      } else if (window.innerHeight - clientY < threshold) {
        window.scrollBy(0, scrollSpeed);
      }
    };

    window.addEventListener("dragover", scrollOnEdge);
    return () => window.removeEventListener("dragover", scrollOnEdge);
  }, []);

  const unassignedExecutives = people.filter(person => !person.teamId);

  return (
    <div style={{ display: "flex" }}>
      <SidebarToggle />
      {isLoading && variant === "admin" && <AdminSpinner text="Loading Executives..." />}
      <div className="executive-details-content">
        <h1 style={{ textAlign: "center", padding: "20px" }}>Executive Details</h1>

        {/* Top Filter */}
        <div className="filter-buttons">
          <select value={filter} onChange={(e) => {
            setFilter(e.target.value);
            setFocusedTeamId("");
            setSelectedMembers([]);
          }}>
            <option value="All">All Executives</option>
            <option value="Manager">All Managers</option>
            <option value="HR">All HR</option>
            <option value="Process">All Process Persons</option>
            <option value="TL">All Team Leads</option>
          </select>

          <button onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}>
            {viewMode === "grid" ? "Table View" : "Grid View"}
          </button>

          {isAdmin && filter === "All" && (
            <select
              className="styled-select"
              style={{ marginLeft: "10px" }}
              value={focusedTeamId}
              onChange={(e) => setFocusedTeamId(e.target.value)}
            >
              <option value="">Select Team</option>
              {managerTeams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          )}

          {isAdmin && filter === "Manager" && selectedManagers.length > 0 && (
            <button className="create-team-button" onClick={() => setShowModal(true)}>
              + Create Team
            </button>
          )}
        </div>

        {/* Traditional Team Assignment Bar */}
        {isAdmin && selectedMembers.length > 0 && filter !== "All" && (
          <div className="team-assignment-bar animated-slide">
            <select
              className="styled-select"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">Select Team</option>
              {isTeamLoading ? (
                <option disabled>Loading teams...</option>
              ) : (
                managerTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))
              )}
            </select>
            <button
              className="styled-button"
              onClick={handleAssignTeam}
              disabled={teamAssigning}
            >
              {teamAssigning ? "Assigning..." : "Assign Selected Members"}
            </button>
          </div>
        )}
        {isAdmin && filter === "All" && (
          <>
            {focusedTeamId ? (
              <div className="drag-drop-container">
                <div className="drag-drop-close-wrapper">
                  <button
                    className="close-drag-container"
                    onClick={() => setFocusedTeamId("")}
                    title="Close"
                  >
                    &times;
                  </button>
                </div>
                <h3>🧩 Drag executives into the selected team</h3>
                <div className="teams-grid">
                  {managerTeams
                    .filter((team) => team.id === Number(focusedTeamId))
                    .map((team) => (
                      <div
                        key={team.id}
                        className={`team-drop-zone ${dragOverTeam === team.id ? 'drag-over' : ''}`}
                        onDragOver={handleDragOver}
                        onDragEnter={(e) => handleDragEnter(e, team.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, team.id)}
                      >
                        <div className="team-header">
                          <strong>{team.name}</strong>
                          <div className="team-subtitle">
                            Manager: {team.managerName || `ID: ${team.managerId || "Unknown"}`}
                          </div>
                        </div>
                        <div className="team-members">
                          {teamMembers[team.id]?.length > 0 ? (
                            teamMembers[team.id].map((member) => (
                              <div key={member.id} className="team-member-item">
                                👤 {member.name} - {member.profession}
                              </div>
                            ))
                          ) : (
                            <div className="empty-team-message">Drop executives here</div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="no-team-selected-message" style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                🔍 Please select a team to view or assign executives
              </div>
            )}
          </>
        )}

        {/* Display Cards or Table */}
        {viewMode === "grid" ? (
          <div className="boxes-container">
            {people.map((person) => (
              <div
                key={person.id}
                className={`box1 ${selectedMembers.includes(person.id) || selectedManagers.includes(person.id)
                  ? "selected-card"
                  : ""
                } ${Number(recentlyAssigned) === Number(person.id) ? "success-border" : ""} 
                ${filter === "All" && !person.teamId ? "draggable-executive unassigned-card" : ""}`}
                style={{ display: "flex", alignItems: "flex-start" }}
                draggable={filter === "All" && !person.teamId}
                onDragStart={(e) => handleDragStart(e, person)}
                onDragEnd={handleDragEnd}
              >
                {filter === "All" && !person.teamId && (
                  <div className="drag-indicator" title="Drag to assign to team">
                    ↔️
                  </div>
                )}
                {isAdmin && filter === "Manager" && (
                  <input
                    type="checkbox"
                    className="team-select-checkbox"
                    checked={selectedManagers.includes(person.id)}
                    onChange={() => handleManagerSelect(person.id)}
                    style={{ marginRight: "10px" }}
                  />
                )}

                <div className="text-content">
                  {person.teamName && (
                    <div className="team-assigned-info">
                      🏷️ {person.teamName}
                    </div>
                  )}
                  <img src={person.image} alt={person.name} className="avatar" />
                  <div><strong>User Id:</strong> {person.id}</div>
                  <span>{person.name}</span>
                  <span>{person.emailId}</span>
                  <span>{person.profession}</span>
                  <span>{person.country}</span>
                  <span>{person.city}</span>
                </div>
                <div className="neo-toggle-container">
                  <input
                    className="neo-toggle-input"
                    id={`neo-toggle-${person.id}`}
                    type="checkbox"
                    checked={person.canLogin || false}
                    disabled={cooldownUsers.has(person.id)}
                    onChange={() => {
                      if (person.profession.toLowerCase() === "executive") {
                        handleToggleLoginStatus(person.id, person.canLogin);
                      } else {
                        handleToggleRoleLoginStatus(person.profession, person.id, person.canLogin);
                      }
                    }}
                  />
                  <label className="neo-toggle" htmlFor={`neo-toggle-${person.id}`}>
                    <div className="neo-track">
                      <div className="neo-background-layer"></div>
                      <div className="neo-grid-layer"></div>
                      <div className="neo-spectrum-analyzer">
                        <div className="neo-spectrum-bar"></div>
                        <div className="neo-spectrum-bar"></div>
                        <div className="neo-spectrum-bar"></div>
                        <div className="neo-spectrum-bar"></div>
                        <div className="neo-spectrum-bar"></div>
                      </div>
                      <div className="neo-track-highlight"></div>
                    </div>
                    <div className="neo-thumb">
                      <div className="neo-thumb-ring"></div>
                      <div className="neo-thumb-core">
                        <div className="neo-thumb-icon">
                          <div className="neo-thumb-wave"></div>
                          <div className="neo-thumb-pulse"></div>
                        </div>
                      </div>
                    </div>
                    <div className="neo-gesture-area"></div>
                    <div className="neo-interaction-feedback">
                      <div className="neo-ripple"></div>
                      <div className="neo-progress-arc"></div>
                    </div>
                    <div className="neo-status">
                      <div className="neo-status-indicator">
                        <div className="neo-status-dot"></div>
                        <div className="neo-status-text"></div>
                      </div>
                    </div>
                  </label>
                  {cooldownUsers.has(person.id) && !person.canLogin && (
                    <div style={{
                      position: "absolute",
                      left: "90px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "12px",
                      color: "#ff4444",
                      fontWeight: "bold",
                      whiteSpace: "nowrap"
                    }}>
                      {cooldownTimers.get(person.id) || 0}s
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="people-table">
              <thead>
                <tr>
                  {isAdmin && filter === "Manager" && <th>Select</th>}
                  <th>Photo</th>
                  <th>Name</th>
                  <th>UserID</th>
                  <th>Profession</th>
                  <th>Technology</th>
                  <th>Email ID</th>
                  <th>City</th>
                  {filter === "All" && <th>Team</th>}
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  <tr key={person.id}>
                    {isAdmin && filter === "Manager" && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedManagers.includes(person.id)}
                          onChange={() => handleManagerSelect(person.id)}
                        />
                      </td>
                    )}
                    <td><img src={person.image} alt={person.name} className="avatar-small" /></td>
                    <td>{person.name}</td>
                    <td>{person.id}</td>
                    <td>{person.profession}</td>
                    <td>{person.technology}</td>
                    <td>{person.emailId}</td>
                    <td>{person.city}</td>
                    {filter === "All" && (
                      <td>
                        {person.teamName ? (
                          <span className="team-assigned-info">{person.teamName}</span>
                        ) : (
                          <span style={{ color: '#6c757d', fontStyle: 'italic' }}>Unassigned</span>
                        )}
                      </td>
                    )}
                    <td style={{ position: "relative" }}>
                      <div className="neo-toggle-container">
                        <input
                          className="neo-toggle-input"
                          id={`neo-toggle-table-${person.id}`}
                          type="checkbox"
                          checked={person.canLogin || false}
                          disabled={cooldownUsers.has(person.id)}
                          onChange={() => {
                            if (person.profession.toLowerCase() === "executive") {
                              handleToggleLoginStatus(person.id, person.canLogin);
                            } else {
                              handleToggleRoleLoginStatus(person.profession, person.id, person.canLogin);
                            }
                          }}
                        />
                        <label className="neo-toggle" htmlFor={`neo-toggle-table-${person.id}`}>
                          <div className="neo-track">
                            <div className="neo-background-layer"></div>
                            <div className="neo-grid-layer"></div>
                            <div className="neo-spectrum-analyzer">
                              <div className="neo-spectrum-bar"></div>
                              <div className="neo-spectrum-bar"></div>
                              <div className="neo-spectrum-bar"></div>
                              <div className="neo-spectrum-bar"></div>
                              <div className="neo-spectrum-bar"></div>
                            </div>
                            <div className="neo-track-highlight"></div>
                          </div>
                          <div className="neo-thumb">
                            <div className="neo-thumb-ring"></div>
                            <div className="neo-thumb-core">
                              <div className="neo-thumb-icon">
                                <div className="neo-thumb-wave"></div>
                                <div className="neo-thumb-pulse"></div>
                              </div>
                            </div>
                          </div>
                          <div className="neo-gesture-area"></div>
                          <div className="neo-interaction-feedback">
                            <div className="neo-ripple"></div>
                            <div className="neo-progress-arc"></div>
                          </div>
                          <div className="neo-status">
                            <div className="neo-status-indicator">
                              <div className="neo-status-dot"></div>
                              <div className="neo-status-text"></div>
                            </div>
                          </div>
                        </label>
                      </div>
                      {cooldownUsers.has(person.id) && !person.canLogin && (
                        <span style={{ fontSize: "10px", color: "red", marginLeft: "5px" }}>
                          {cooldownTimers.get(person.id) || 0}s
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for creating new team */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              Add New Team
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateTeam}>
              <label>Team Name</label>
              <input
                type="text"
                placeholder="Enter team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                required
              />
              <div className="admin-modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-close">
                  Cancel
                </button>
                <button type="submit" className="btn-save">Create Team</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showPopup && (
        <div className={`custom-popup`}>
          <div className="popup-content">
            <span className="popup-message">{popupMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveDetails;