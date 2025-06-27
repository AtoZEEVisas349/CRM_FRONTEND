
import React, { useState, useEffect } from "react";
import img2 from "../../assets/img3.jpg";
import SidebarToggle from "./SidebarToggle";
import { useApi } from "../../context/ApiContext";

import { toast } from "react-toastify";
import { isAuthenticated } from "../../services/auth";
import "../../styles/adminexedetails.css";
import { useLoading } from "../../context/LoadingContext";
import AdminSpinner from "../spinner/AdminSpinner";
const ExecutiveDetails = () => {
  const {
    fetchExecutivesAPI,
    fetchAllManagersAPI,
    fetchAllHRsAPI,
    fetchAllProcessPersonsAPI,
    updateUserLoginStatus,
  } = useApi();
  
  const { showLoader, hideLoader, isLoading, variant } = useLoading();
  const [people, setPeople] = useState([]);
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [toggleStates, setToggleStates] = useState({});
  const [cooldowns, setCooldowns] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldownAlert, setCooldownAlert] = useState({
    visible: false,
    message: "",
    userId: null,
  });

  // 15 minutes in milliseconds
  const COOLDOWN_DURATION = 30 * 1000; // 30 seconds
  const COOLDOWN_STORAGE_KEY = "executive_toggle_cooldowns";

  // Load cooldowns from localStorage on component mount
  const loadCooldownsFromStorage = () => {
    try {
      const stored = localStorage.getItem(COOLDOWN_STORAGE_KEY);
      if (stored) {
        const cooldownData = JSON.parse(stored);
        const now = Date.now();

        // Filter out expired cooldowns
        const activeCooldowns = {};
        Object.entries(cooldownData).forEach(([userId, data]) => {
          if (data.endTime > now) {
            activeCooldowns[userId] = data;
          }
        });

        return activeCooldowns;
      }
    } catch (error) {
      console.error("❌ Error loading cooldowns from storage:", error);
      // Clear corrupted data
      localStorage.removeItem(COOLDOWN_STORAGE_KEY);
    }
    return {};
  };

  // Save cooldowns to localStorage
  const saveCooldownsToStorage = (cooldownData) => {
    try {
      localStorage.setItem(COOLDOWN_STORAGE_KEY, JSON.stringify(cooldownData));
    } catch (error) {
      console.error("❌ Error saving cooldowns to storage:", error);
    }
  };

  // Initialize cooldowns from localStorage
  useEffect(() => {
    const storedCooldowns = loadCooldownsFromStorage();
    setCooldowns(storedCooldowns);
  }, []);

  // Cleanup expired cooldowns periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const allCooldowns = loadCooldownsFromStorage();
      const activeCooldowns = {};
      let hasChanges = false;

      Object.entries(allCooldowns).forEach(([userId, data]) => {
        if (data.endTime > now) {
          activeCooldowns[userId] = data;
        } else {
          hasChanges = true;
        }
      });

      if (hasChanges) {
        saveCooldownsToStorage(activeCooldowns);
        setCooldowns(activeCooldowns);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(cleanupInterval);
  }, []);

  // Format time remaining for cooldown
  const formatTimeRemaining = (milliseconds) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Fetch executive data
  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader("Loading data...", "admin");

        let data = [];
        if (filter === "All") {
          data = await fetchExecutivesAPI();
        } else if (filter === "Manager") {
          data = await fetchAllManagersAPI();
        } else if (filter === "HR") {
          data = await fetchAllHRsAPI();
        } else if (filter === "Process") {
          data = await fetchAllProcessPersonsAPI();
        }        
      

        const mapped = data.map((person) => ({
          id: person.id,
          image: img2,
          name: person.name || person.fullName || "Unknown", // fallback to fullName
          profession:
            person.role || (filter === "Process" ? "Process" : "User"), // assign profession
          technology: person.skills || "Not specified",
          emailId: person.email || "N/A",
          country: person.country || "N/A",
          city: person.city || "N/A",
          canLogin: person.can_login,
        }));

        setPeople(mapped);
        const toggles = {};
        mapped.forEach((p) => {
          toggles[p.id] = p.canLogin;
        });
        setToggleStates(toggles);
      } catch (err) {
        console.error("❌ Error fetching people:", err);
        setPeople([]);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, [filter]);

  // Check if user is in cooldown and get remaining time
  const getCooldownInfo = (id) => {
    const cooldownData = cooldowns[id];
    if (!cooldownData || !cooldownData.active)
      return { inCooldown: false, timeRemaining: 0 };

    const now = Date.now();
    const timeRemaining = cooldownData.endTime - now;

    if (timeRemaining <= 0) {
      // Cooldown expired, remove it from both state and localStorage
      const updatedCooldowns = {
        ...cooldowns,
        [id]: { ...cooldowns[id], active: false },
      };
      setCooldowns(updatedCooldowns);

      // Remove from localStorage
      const allCooldowns = loadCooldownsFromStorage();
      delete allCooldowns[id];
      saveCooldownsToStorage(allCooldowns);

      return { inCooldown: false, timeRemaining: 0 };
    }

    return { inCooldown: true, timeRemaining };
  };

  // Show cooldown alert with better information
  const showCooldownAlert = (userId, timeRemaining) => {
    const formattedTime = formatTimeRemaining(timeRemaining);
    const userName =
      people.find((p) => p.id === userId)?.name || `User ${userId}`;
    setCooldownAlert({
      visible: true,
      message: `${userName}'s credentials were recently modified. Please wait ${formattedTime} before making changes again.`,
      userId,
    });

    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      setCooldownAlert((prev) => ({ ...prev, visible: false }));
    }, 5000);
  };

  const filteredPeople = people.filter((person) => {
    if (filter === "All") return true;
    return person.profession === filter;
  });

  const handleToggle = async (id) => {
    if (!isAuthenticated() || loadingStates[id]) return;

    // Check cooldown
    const { inCooldown, timeRemaining } = getCooldownInfo(id);
    if (inCooldown) {
      showCooldownAlert(id, timeRemaining);
      return;
    }

    const currentPerson = people.find((p) => p.id === id);
    const current = toggleStates[id] ?? currentPerson?.canLogin ?? false;
    const next = !current;

    // Set loading state for this specific toggle
    setLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      // Make API call to update login status
      await updateUserLoginStatus(id, next);

      // Update both local state and people array
      setToggleStates((prev) => ({ ...prev, [id]: next }));

      // Update the people array to keep data in sync
      setPeople((prev) =>
        prev.map((person) =>
          person.id === id ? { ...person, canLogin: next } : person
        )
      );

      // Show popup only when toggled to OFF
      if (!next) {
        setPopupText("Hey, your credentials have been turned OFF.");
        setPopupVisible(true);
        setTimeout(() => setPopupVisible(false), 3000);
      } else {
        toast.success("User credentials have been enabled successfully!");
      }

      // Set 15-minute cooldown and persist to localStorage
      const endTime = Date.now() + COOLDOWN_DURATION;
      const cooldownData = {
        active: true,
        endTime: endTime,
        startTime: Date.now(),
        userId: id,
        userName: currentPerson?.name || `User ${id}`,
      };

      // Update local state
      setCooldowns((prev) => ({
        ...prev,
        [id]: cooldownData,
      }));

      // Save to localStorage
      const allCooldowns = loadCooldownsFromStorage();
      allCooldowns[id] = cooldownData;
      saveCooldownsToStorage(allCooldowns);

      // Set timeout to auto-remove cooldown (in case user stays on page)
      setTimeout(() => {
        setCooldowns((prev) => ({
          ...prev,
          [id]: { ...prev[id], active: false },
        }));

        // Also remove from localStorage
        const updatedCooldowns = loadCooldownsFromStorage();
        delete updatedCooldowns[id];
        saveCooldownsToStorage(updatedCooldowns);
      }, COOLDOWN_DURATION);
    } catch (error) {
      console.error("❌ Error updating login status:", error);
      toast.error("Failed to update user credentials. Please try again.");
    } finally {
      // Clear loading state
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SidebarToggle />
      {isLoading && variant === "admin" && (
        <AdminSpinner text="Loading Executives..." />
      )}
      <div>
        <h1 style={{ textAlign: "center", padding: "20px" }}>
          Executive Details
        </h1>

        <div className="filter-buttons">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "6px", borderRadius: "5px" }}
          >
            <option value="All">All Executives</option>
            <option value="Manager">All Managers</option>
            <option value="HR">All HR</option>
            <option value="Process">All Process Persons</option>
          </select>
          <button onClick={() => setFilter("Team Lead")}>Team Lead</button>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
          >
            {viewMode === "grid" ? "Table View" : "Grid View"}
          </button>
        </div>

        {/* Active Cooldowns Display */}
        {Object.keys(cooldowns).filter((id) => {
          const { inCooldown } = getCooldownInfo(id);
          return inCooldown;
        }).length > 0 && (
          <div className="active-cooldowns-banner">
            <div className="cooldown-banner-icon">🕒</div>
            <div className="cooldown-banner-text">
              <strong>Active Cooldowns:</strong>{" "}
              {Object.keys(cooldowns)
                .filter((id) => {
                  const { inCooldown } = getCooldownInfo(id);
                  return inCooldown;
                })
                .map((id) => {
                  const person = people.find((p) => p.id === parseInt(id));
                  const { timeRemaining } = getCooldownInfo(id);
                  return `${
                    person?.name || `User ${id}`
                  } (${formatTimeRemaining(timeRemaining)})`;
                })
                .join(", ")}
            </div>
          </div>
        )}

        {loading ? (
          <div>Loading executives...</div>
        ) : viewMode === "grid" ? (
          <div className="boxes-container">
            {filteredPeople.map((person) => {
              const { inCooldown } = getCooldownInfo(person.id);
              return (
                <div key={person.id} className="box1">
                  <div
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "left",
                      gap: "8px",
                      justifyContent: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: "15px" }}>User Credentials:</span>
                    <label
                      className={`switch ${inCooldown ? "cooldown" : ""}`}
                      title={
                        inCooldown
                          ? "Cooldown active - please wait before toggling again"
                          : ""
                      }
                    >
                      <input
                        type="checkbox"
                        checked={
                          toggleStates[person.id] ?? person.canLogin ?? false
                        }
                        onChange={() => handleToggle(person.id)}
                        disabled={loadingStates[person.id] || inCooldown}
                      />
                      <span className="sliderexe round">
                        <span className="switch-text">
                          {toggleStates[person.id] ?? person.canLogin ?? false
                            ? "ON"
                            : "OFF"}
                        </span>
                      </span>
                    </label>
                    {inCooldown && (
                      <span
                        className="cooldown-indicator"
                        title="Cooldown active"
                      >
                        🕒
                      </span>
                    )}
                  </div>

                  <img
                    src={person.image}
                    alt={person.name}
                    className="avatar"
                  />
                  <div className="text-content">
                    <div>
                      <span className="field-value">User Id:</span> {person.id}
                    </div>
                    <span className="field-value">{person.name}</span>
                    <span className="field-value">{person.emailId}</span>
                    <span className="field-value">{person.profession}</span>
                    <span className="field-value">{person.country}</span>
                    <span className="field-value">{person.city}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <table className="people-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Disable</th>
                <th>Name</th>
                <th>UserID</th>
                <th>Profession</th>
                <th>Technology</th>
                <th>Email ID</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeople.map((person) => {
                const { inCooldown } = getCooldownInfo(person.id);
                return (
                  <tr key={person.id}>
                    <td>
                      <img
                        src={person.image}
                        alt={person.name}
                        className="avatar-small"
                      />
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <label
                          className={`switch ${inCooldown ? "cooldown" : ""}`}
                          title={
                            inCooldown
                              ? "Cooldown active - please wait before toggling again"
                              : ""
                          }
                        >
                          <input
                            type="checkbox"
                            checked={
                              toggleStates[person.id] ??
                              person.canLogin ??
                              false
                            }
                            onChange={() => handleToggle(person.id)}
                            disabled={loadingStates[person.id] || inCooldown}
                          />
                          <span className="sliderexe round">
                            <span className="switch-text">
                              {toggleStates[person.id] ??
                              person.canLogin ??
                              false
                                ? "ON"
                                : "OFF"}
                            </span>
                          </span>
                        </label>
                        {inCooldown && (
                          <span
                            className="cooldown-indicator"
                            title="Cooldown active"
                          >
                            🕒
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{person.name}</td>
                    <td>{person.id}</td>
                    <td>{person.profession}</td>
                    <td>{person.technology}</td>
                    <td>{person.emailId}</td>
                    <td>{person.city}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {popupVisible && (
          <div className="popup-message">
            <em>{popupText}</em>
          </div>
        )}

        {/* Stylish Cooldown Alert */}
        {cooldownAlert.visible && (
          <div className="cooldown-alert-overlay">
            <div className="cooldown-alert">
              <div className="cooldown-alert-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
                    fill="currentColor"
                  />
                  <path
                    d="M13 7h-2v6h2V7zM13 15h-2v2h2v-2z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="cooldown-alert-content">
                <h3>Cooldown Active</h3>
                <p>{cooldownAlert.message}</p>
              </div>
              <button
                className="cooldown-alert-close"
                onClick={() =>
                  setCooldownAlert((prev) => ({ ...prev, visible: false }))
                }
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="invoice-pagination">
          <span className="invoice-page-nav">« Prev</span>
          <span>Page 1 of 5</span>
          <span className="invoice-page-nav">Next »</span>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDetails;

