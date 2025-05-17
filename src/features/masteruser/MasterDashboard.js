import React, { useEffect, useState } from 'react';
import '../../styles/masterdash.css';
import { useCompany } from '../../context/CompanyContext';
import AddCompanyModal from './AddCompanyModal';

const MasterDashboard = () => {
  const { companies, fetchCompanies, loading, error } = useCompany();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCompanies(); // Initial fetch
  }, []);  

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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.id}</td>
                  <td>{company.name}</td>
                  <td>{company.db_name}</td>
                  <td>{new Date(company.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className="status active">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <p>No companies found.</p>
        )}
      </div>

      {/* ✅ Modal rendered outside blurred section */}
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
