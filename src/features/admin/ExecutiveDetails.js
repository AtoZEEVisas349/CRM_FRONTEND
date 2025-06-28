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
    fetchAllTeamLeadsAPI,
  } = useApi();

  const { showLoader, hideLoader, isLoading, variant } = useLoading();
  const [people, setPeople] = useState([]);
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

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
        } else if (filter === "TL") {
          data = await fetchAllTeamLeadsAPI();
        }

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
        }));

        setPeople(mapped);
      } catch (err) {
        console.error("❌ Error fetching people:", err);
        setPeople([]);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, [filter]);

  const handleMemberSelect = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleAssignTeam = () => {
    if (!selectedTeam || selectedMembers.length === 0) {
      toast.error("Select a team and at least one member.");
      return;
    }

    // Here you would call your API to assign selectedMembers to selectedTeam
    console.log("Assigning", selectedMembers, "to Team", selectedTeam);
    toast.success(`Assigned ${selectedMembers.length} members to Team ${selectedTeam}`);

    setSelectedMembers([]);
    setSelectedTeam("");
  };

  return (
    <div style={{ display: "flex" }}>
      <SidebarToggle />
      {isLoading && variant === "admin" && <AdminSpinner text="Loading Executives..." />}
      <div>
        <h1 style={{ textAlign: "center", padding: "20px" }}>Executive Details</h1>

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
            <option value="TL">All Team Leads</option>
          </select>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
          >
            {viewMode === "grid" ? "Table View" : "Grid View"}
          </button>
        </div>

        <div className="team-assignment-bar">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">Select Team</option>
            <option value="A">Team A</option>
            <option value="B">Team B</option>
            <option value="C">Team C</option>
          </select>
          <button onClick={handleAssignTeam}>Assign Selected Members</button>
        </div>

        {viewMode === "grid" ? (
          <div className="boxes-container">
            {people.map((person) => (
              <div
                key={person.id}
                className={`box1 ${selectedMembers.includes(person.id) ? "selected-card" : ""}`}
              >
                <input
                  type="checkbox"
                  className="team-select-checkbox"
                  checked={selectedMembers.includes(person.id)}
                  onChange={() => handleMemberSelect(person.id)}
                />
                <img src={person.image} alt={person.name} className="avatar" />
                <div className="text-content">
                  <div><span className="field-value">User Id:</span> {person.id}</div>
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
                <th>Select</th>
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
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(person.id)}
                      onChange={() => handleMemberSelect(person.id)}
                    />
                  </td>
                  <td>
                    <img
                      src={person.image}
                      alt={person.name}
                      className="avatar-small"
                    />
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
      </div>
    </div>
  );
};

export default ExecutiveDetails;
