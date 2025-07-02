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
    fetchManagerTeams,
    managerTeams,
    assignExecutiveToTeam,
  } = useApi();
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const { showLoader, hideLoader, isLoading, variant } = useLoading();

  const [people, setPeople] = useState([]);
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [isTeamLoading, setIsTeamLoading] = useState(false);
  const [teamAssigning, setTeamAssigning] = useState(false);

  // 1️⃣ Fetch people on filter change
  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader("Loading data...", "admin");
        let data = [];

        if (filter === "All") data = await fetchExecutivesAPI();
        else if (filter === "Manager") data = await fetchAllManagersAPI();
        else if (filter === "HR") data = await fetchAllHRsAPI();
        else if (filter === "Process") data = await fetchAllProcessPersonsAPI();
        else if (filter === "TL") data = await fetchAllTeamLeadsAPI();

        const mapped = data.map((person) => ({
          id: person.id,
          image: img2,
          name: person.name || person.fullName || person.firstname || person.username || "Unknown",
          profession: person.role || filter || "User",
          technology: person.skills || "Not specified",
          emailId: person.email || "N/A",
          country: person.country || "N/A",
          city: person.city || "N/A",
          canLogin: person.can_login,
          teamName: person.teamName || person.team?.name || null,
        }));

        setPeople(mapped);
        setSelectedMembers([]);
        setSelectedManagers([]);
      } catch (err) {
        console.error("❌ Error fetching people:", err);
        setPeople([]);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, [filter]);

  // 2️⃣ Auto-fetch teams when executives selected
  useEffect(() => {
    const loadTeamsIfExecutivesSelected = async () => {
      if (filter === "All" && selectedMembers.length > 0 && managerTeams.length === 0) {
        setIsTeamLoading(true);
        await fetchManagerTeams(); // uses user.id from localStorage
        setIsTeamLoading(false);
      }
    };
    loadTeamsIfExecutivesSelected();
  }, [selectedMembers]);

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
  
    setTeamAssigning(true); // start loading
    try {
      const responses = await Promise.all(
        selectedMembers.map((executiveId) =>
          assignExecutiveToTeam({
            teamId: Number(selectedTeam),
            executiveId: Number(executiveId),
            managerId: Number(user?.id),
          })
        )
      );
  
      setPeople((prevPeople) =>
        prevPeople.map((person) => {
          const updated = responses.find((res) => res.user?.id === person.id);
          if (updated) {
            const assignedTeam = managerTeams.find((team) => team.id === updated.user.team_id);
            return {
              ...person,
              teamName: assignedTeam ? assignedTeam.name : `Team ${updated.user.team_id}`,
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
      setTeamAssigning(false); // stop loading
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
      await fetchManagerTeams(managerId);
      toast.success(`Team "${newTeamName}" created successfully!`);
      setNewTeamName("");
      setShowModal(false);
    } catch (err) {
      toast.error("Error creating team.");
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SidebarToggle />
      {isLoading && variant === "admin" && <AdminSpinner text="Loading Executives..." />}
      <div className="executive-details-content">
        <h1 style={{ textAlign: "center", padding: "20px" }}>Executive Details</h1>

        {/* Top Filter */}
        <div className="filter-buttons">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Executives</option>
            <option value="Manager">All Managers</option>
            <option value="HR">All HR</option>
            <option value="Process">All Process Persons</option>
            <option value="TL">All Team Leads</option>
          </select>
          <button onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}>
            {viewMode === "grid" ? "Table View" : "Grid View"}
          </button>
          {isAdmin && filter === "Manager" && selectedManagers.length > 0 && (
            <button className="create-team-button" onClick={() => setShowModal(true)}>
              + Create Team
            </button>
          )}
        </div>

        {/* Team Assignment Bar */}
        {isAdmin && selectedMembers.length > 0 && (
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

        {/* Display Cards or Table */}
        {viewMode === "grid" ? (
          <div className="boxes-container">
            {people.map((person) => (
              <div
                key={person.id}
                className={`box1 ${
                  selectedMembers.includes(person.id) || selectedManagers.includes(person.id)
                    ? "selected-card"
                    : ""
                }`}
                style={{ display: "flex", alignItems: "flex-start" }}
              >
                {isAdmin && (filter === "All" || filter === "Manager") && (
                  <input
                    type="checkbox"
                    className="team-select-checkbox"
                    checked={
                      filter === "Manager"
                        ? selectedManagers.includes(person.id)
                        : selectedMembers.includes(person.id)
                    }
                    onChange={() =>
                      filter === "Manager"
                        ? handleManagerSelect(person.id)
                        : handleMemberSelect(person.id)
                    }
                    style={{ marginRight: "10px" }}
                  />
                )}
                <div className="text-content">
                  {person.teamName && (
                    <div className="team-name-banner">
                      <strong>Team:</strong> {person.teamName}
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
              </div>
            ))}
          </div>
        ) : (
          <table className="people-table">
            <thead>
              <tr>
                {isAdmin && (filter === "All" || filter === "Manager") && <th>Select</th>}
                <th>Photo</th>
                <th>Name</th>
                <th>UserID</th>
                <th>Profession</th>
                <th>Technology</th>
                <th>Email ID</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id}>
                  <td>
                    {isAdmin && (filter === "All" || filter === "Manager") && (
                      <input
                        type="checkbox"
                        checked={
                          filter === "Manager"
                            ? selectedManagers.includes(person.id)
                            : selectedMembers.includes(person.id)
                        }
                        onChange={() =>
                          filter === "Manager"
                            ? handleManagerSelect(person.id)
                            : handleMemberSelect(person.id)
                        }
                      />
                    )}
                  </td>
                  <td><img src={person.image} alt={person.name} className="avatar-small" /></td>
                  <td>{person.name}</td>
                  <td>{person.id}</td>
                  <td>{person.profession}</td>
                  <td>{person.technology}</td>
                  <td>{person.emailId}</td>
                  <td>{person.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for creating new team */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2 className="modal-header">
              Add New Team
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </h2>
            <form onSubmit={handleCreateTeam}>
              <label>Team Name</label>
              <input
                type="text"
                placeholder="Team Name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                required
              />
              <div className="admin-modal-actions right-align">
                <button type="button" onClick={() => setShowModal(false)} className="btn-close">
                  Close
                </button>
                <button type="submit" className="btn-save">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveDetails;
