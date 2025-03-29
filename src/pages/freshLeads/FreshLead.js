import React, { useEffect, useState } from "react";
import { FaPhone } from "react-icons/fa";
import { fetchAssignedLeads } from "../../api/apiService"; // Import API function

const FreshLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true);
        const data = await fetchAssignedLeads(); // Fetch dynamically
        setLeads(data);
      } catch (err) {
        setError("Failed to load leads. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Assigned Leads</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading leads...</p>
      ) : error ? (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ background: "#f4f4f4", textAlign: "left" }}>
              <th style={{ padding: "10px" }}>Name</th>
              <th style={{ padding: "10px" }}>Phone</th>
              <th style={{ padding: "10px" }}>Email</th>
              <th style={{ padding: "10px" }}>Add follow-ups</th>
              <th style={{ padding: "10px" }}>Status</th>
              <th style={{ padding: "10px" }}>Call</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px", display: "flex", alignItems: "center" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%", background: "#ddd",
                      display: "flex", justifyContent: "center", alignItems: "center", marginRight: "10px"
                    }}>
                      👤
                    </div>
                    <strong>{lead.name}</strong>
                  </td>
                  <td style={{ padding: "10px" }}>{lead.phone}</td>
                  <td style={{ padding: "10px" }}>{lead.email}</td>
                  <td style={{ padding: "10px" }}>
                    <button style={{
                      padding: "5px 10px", border: "none", background: "#eee", borderRadius: "5px",
                      cursor: "pointer"
                    }}>
                      Call today
                    </button>
                  </td>
                  <td style={{ padding: "10px" }}>⭘</td>
                  <td style={{ padding: "10px" }}>
                    <FaPhone style={{ cursor: "pointer", color: "#007bff" }} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>No assigned leads available.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FreshLeads;
