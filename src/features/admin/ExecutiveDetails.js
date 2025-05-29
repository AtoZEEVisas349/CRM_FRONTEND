import React, { useState, useEffect } from "react";
import img2 from "../../assets/img3.jpg";
import SidebarToggle from "./SidebarToggle";
import { useApi } from "../../context/ApiContext";
import { toast } from "react-toastify";
import { isAuthenticated } from "../../services/auth";
import "../../styles/adminexedetails.css";

const ExecutiveDetails = () => {
  const { fetchExecutivesAPI, updateUserLoginStatus } = useApi();

  const [people, setPeople] = useState([]);
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [toggleStates, setToggleStates] = useState({});
  const [cooldowns, setCooldowns] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch executive data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const executives = await fetchExecutivesAPI();
        const mapped = executives.map((executive) => ({
          id: executive.id,
          image: img2,
          name: executive.name || "Unknown",
          profession: executive.role || "Executive",
          technology: executive.skills || "Not specified",
          emailId: executive.email || "N/A",
          country: executive.country || "N/A",
          city: executive.city || "N/A",
          canLogin: executive.can_login,
        }));
        setPeople(mapped);
        const toggles = {};
        mapped.forEach((p) => {
          toggles[p.id] = true; // Default to ON
        });
        setToggleStates(toggles);
      } catch (error) {
        console.error("❌ Error fetching executives:", error);
        setPeople([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchExecutivesAPI]);

  const filteredPeople = people.filter((person) =>
    filter === "All" ? true : person.profession.includes(filter)
  );

  const handleToggle = async (id) => {
    if (!isAuthenticated() || loadingStates[id]) return;

    const current = toggleStates[id] ?? true;
    const next = !current;

    setToggleStates((prev) => ({ ...prev, [id]: next }));

    // Show popup only when toggled to OFF
    if (!next) {
      setPopupText("Hey, your credentials have been turned OFF.");
      setPopupVisible(true);
      setTimeout(() => setPopupVisible(false), 3000);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SidebarToggle />
      <div>
        <h1 style={{ textAlign: "center", padding: "20px" }}>
          Executive Details
        </h1>

        <div className="filter-buttons">
          <button onClick={() => setFilter("All")}>All</button>
          <button onClick={() => setFilter("Team Lead")}>Team Lead</button>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
          >
            {viewMode === "grid" ? "Table View" : "Grid View"}
          </button>
        </div>

        {loading ? (
          <div>Loading executives...</div>
        ) : viewMode === "grid" ? (
          <div className="boxes-container">
            {filteredPeople.map((person) => (
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
                    className={`switch ${
                      cooldowns[person.id] ? "cooldown" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={toggleStates[person.id] ?? true}
                      onChange={() => handleToggle(person.id)}
                      disabled={loadingStates[person.id]}
                    />
                    <span className="sliderexe round">
                      <span className="switch-text">
                        {toggleStates[person.id] ?? true ? "ON" : "OFF"}
                      </span>
                    </span>
                  </label>
                </div>

                <img src={person.image} alt={person.name} className="avatar" />
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
            ))}
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
              {filteredPeople.map((person) => (
                <tr key={person.id}>
                  <td>
                    <img
                      src={person.image}
                      alt={person.name}
                      className="avatar-small"
                    />
                  </td>
                  <td>
                    <label
                      className={`switch ${
                        cooldowns[person.id] ? "cooldown" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={toggleStates[person.id] ?? true}
                        onChange={() => handleToggle(person.id)}
                        disabled={loadingStates[person.id]}
                      />
                      <span className="sliderexe round">
                        <span className="switch-text">
                          {toggleStates[person.id] ?? true ? "ON" : "OFF"}
                        </span>
                      </span>
                    </label>
                  </td>
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

        {popupVisible && (
          <div className="popup-message">
            <em>{popupText}</em>
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