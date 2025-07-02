import React, { useEffect, useState } from 'react';
import '../../styles/masterdash.css';
import { useCompany } from '../../context/CompanyContext';
import AddCompanyModal from './AddCompanyModal';

const MasterDashboard = () => {
  const {
    companies,
    fetchCompanies,
    loading,
    error,
    pauseCompany,
    resumeCompany,
    updateCompanyExpiry
  } = useCompany();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCompanies(); // Initial fetch
  }, []);

  // 👉 Pause handler
  const handlePause = async (id) => {
    if (window.confirm("Pause this company?")) {
      try {
        await pauseCompany(id);
        await fetchCompanies();
      } catch (err) {
        alert(err?.error || "Failed to pause company");
      }
    }
  };

  // 👉 Resume handler
  const handleResume = async (id) => {
    try {
      await resumeCompany(id);
      await fetchCompanies();
    } catch (err) {
      alert(err?.error || "Failed to resume company");
    }
  };

  // 👉 Expiry handler
  const handleSetExpiry = async (id) => {
    const input = prompt("Enter expiry date (YYYY-MM-DD):");
    if (!input) return;

    try {
      const iso = new Date(input).toISOString();
      await updateCompanyExpiry(id, iso);
      await fetchCompanies();
    } catch (err) {
      alert(err?.error || "Failed to set expiry date");
    }
  };

  return (
    <>
      <div className={`table-section ${showModal ? 'blurred' : ''}`}>
        <div className="table-header">
          <h2>Companies</h2>
          <button className="add-button" onClick={() => setShowModal(true)}>
            + Add New Company
          </button>
        </div>

        {error && companies.length === 0 && (
          <p className="error-text">{error}</p>
        )}

        {!loading && companies.length > 0 ? (
          <table className="company-table">
            <thead>
              <tr>
                <th>Company ID</th>
                <th>Company Name</th>
                <th>DB Name</th>
                <th>Created At</th>
                <th>Expiry Date</th>
                <th>Status / Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => {
                const status = company.status?.toLowerCase() || "unknown";

                return (
                  <tr key={company.id}>
                    <td>{company.id}</td>
                    <td>{company.name}</td>
                    <td>{company.db_name}</td>
                    <td>{new Date(company.createdAt).toLocaleDateString()}</td>
                    <td>
                      {company.expiryDate
                        ? new Date(company.expiryDate).toLocaleDateString()
                        : <span style={{ fontStyle: "italic", color: "#888" }}>None</span>}
                    </td>
                    <td>
                      <span className={`status ${status}`}>{status}</span>
                      <div className="company-actions">
                        {status === "active" && (
                          <>
                            <button
                              className="pause-btn"
                              onClick={() => handlePause(company.id)}
                            >
                              Pause
                            </button>
                            <button
                              className="expiry-btn"
                              onClick={() => handleSetExpiry(company.id)}
                            >
                              Set Expiry
                            </button>
                          </>
                        )}
                        {status === "paused" && (
                          <button
                            className="resume-btn"
                            onClick={() => handleResume(company.id)}
                          >
                            Resume
                          </button>
                        )}
                        {status === "unknown" && (
                          <span style={{ fontSize: "12px", color: "#888" }}>
                            No actions available
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          !loading && <p>No companies found.</p>
        )}
      </div>

      {showModal && (
        <AddCompanyModal
          onClose={() => setShowModal(false)}
          onCreated={fetchCompanies}
        />
      )}
    </>
  );
};

export default MasterDashboard;
