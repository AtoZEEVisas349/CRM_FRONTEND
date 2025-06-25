import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, CheckCircle, XCircle, Filter, Search, Download } from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import '../../styles/leave-managment.css';

const LeaveManagement = () => {
  const { fetchExecutivesAPI, fetchLeaveApplicationsAPI, updateLeaveStatusAPI, user } = useApi();
  const [allLeaveApplications, setAllLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    const fetchAllLeaves = async () => {
      setLoading(true);
      try {
        // Step 1: Fetch all executives
        const executives = await fetchExecutivesAPI();
        // Step 2: Fetch leave applications for each executive in parallel
        const leavePromises = executives.map(exec => fetchLeaveApplicationsAPI(exec.id));
        const leaveResults = await Promise.all(leavePromises);
        // Step 3: Combine all leave applications into a single array
        const allLeaves = leaveResults.flat();
        setAllLeaveApplications(allLeaves);
      } catch (error) {
        console.error("Error fetching all leave applications:", error);
        setAllLeaveApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllLeaves();
  }, [fetchExecutivesAPI]);

  const handleApprove = async (id) => {
    try {
      await updateLeaveStatusAPI(id, 'Approved');
      // Refresh the leave applications after approval
      const executives = await fetchExecutivesAPI();
      const leavePromises = executives.map(exec => fetchLeaveApplicationsAPI(exec.id));
      const leaveResults = await Promise.all(leavePromises);
      setAllLeaveApplications(leaveResults.flat());
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateLeaveStatusAPI(id, 'Rejected');
      // Refresh the leave applications after rejection
      const executives = await fetchExecutivesAPI();
      const leavePromises = executives.map(exec => fetchLeaveApplicationsAPI(exec.id));
      const leaveResults = await Promise.all(leavePromises);
      setAllLeaveApplications(leaveResults.flat());
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };

  const filteredRequests = allLeaveApplications.filter(request => {
    const matchesFilter = selectedFilter === 'all' || request.status.toLowerCase() === selectedFilter;
    const matchesSearch = request.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'lm-status-approved';
      case 'rejected': return 'lm-status-rejected';
      case 'pending': return 'lm-status-pending';
      default: return 'lm-status-pending';
    }
  };

  const stats = {
    total: allLeaveApplications.length,
    pending: allLeaveApplications.filter(r => r.status.toLowerCase() === 'pending').length,
    approved: allLeaveApplications.filter(r => r.status.toLowerCase() === 'approved').length,
    rejected: allLeaveApplications.filter(r => r.status.toLowerCase() === 'rejected').length
  };

  if (loading) {
    return (
      <div className="lm-loading-container">
        Loading leave applications...
      </div>
    );
  }

  return (
    <div className="lm-leave-management-container">
      {/* Header */}
      <div className="lm-leave-management-header">
        <div>
          <h1 className="lm-header-title">
            Employee Leave Management
          </h1>
          <p className="lm-header-subtitle">
            Executive Dashboard - Manage and approve employee leave requests
          </p>
        </div>
        <div className="lm-header-actions">
          <button className="lm-export-btn">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lm-main-content">
        {/* Stats Cards */}
        <div className="lm-stats-grid">
          <div className="lm-stat-card">
            <div className="lm-stat-icon lm-stat-icon-total">
              <Calendar size={24} color="#3b82f6" />
            </div>
            <div>
              <div className="lm-stat-value">{stats.total}</div>
              <div className="lm-stat-label">Total Requests</div>
            </div>
          </div>

          <div className="lm-stat-card">
            <div className="lm-stat-icon lm-stat-icon-pending">
              <Clock size={24} color="#f59e0b" />
            </div>
            <div>
              <div className="lm-stat-value">{stats.pending}</div>
              <div className="lm-stat-label">Pending Approval</div>
            </div>
          </div>

          <div className="lm-stat-card">
            <div className="lm-stat-icon lm-stat-icon-approved">
              <CheckCircle size={24} color="#10b981" />
            </div>
            <div>
              <div className="lm-stat-value">{stats.approved}</div>
              <div className="lm-stat-label">Approved</div>
            </div>
          </div>

          <div className="lm-stat-card">
            <div className="lm-stat-icon lm-stat-icon-rejected">
              <XCircle size={24} color="#ef4444" />
            </div>
            <div>
              <div className="lm-stat-value">{stats.rejected}</div>
              <div className="lm-stat-label">Rejected</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="lm-filters-container">
          <div className="lm-filter-label">
            <Filter size={20} color="#6b7280" />
            <span>Filter:</span>
          </div>
          {['all', 'pending', 'approved', 'rejected'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`lm-filter-btn ${selectedFilter === filter ? 'lm-filter-btn-active' : 'lm-filter-btn-inactive'}`}
            >
              {filter === 'all' ? 'All Requests' : filter}
            </button>
          ))}
          <div className="lm-search-container">
            <Search size={18} color="#6b7280" className="lm-search-icon" />
            <input
              type="text"
              placeholder="Search employees, leave types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="lm-search-input"
            />
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="lm-table-container">
          <div className="lm-table-wrapper">
            <table className="lm-leave-table">
              <thead>
                <tr className="lm-table-header">
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="lm-table-row">
                    <td className="lm-table-cell">
                      <div className="lm-employee-info">
                        <div className="lm-employee-avatar">
                          {request.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="lm-employee-name">
                            {request.fullName}
                          </div>
                          <div className="lm-employee-details">
                            {request.positionTitle} • {request.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="lm-table-cell">
                      <span className="lm-leave-type-badge">
                        {request.leaveType}
                      </span>
                    </td>
                    <td className="lm-table-cell">
                      <div className="lm-duration-days">
                        {request.totalDays} days
                      </div>
                      <div className="lm-duration-dates">
                        {request.startDate} to {request.endDate}
                      </div>
                    </td>
                    <td className="lm-table-cell">
                      <span className={`lm-status-badge ${getStatusClass(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="lm-table-cell lm-applied-date">
                      {request.appliedDate}
                    </td>
                    <td className="lm-table-cell">
                      <div className="lm-actions-container">
                        <button
                          onClick={() => setSelectedLeave(request)}
                          className="lm-action-btn"
                        >
                          View
                        </button>
                        {request.status.toLowerCase() === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="lm-approve-btn"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="lm-reject-btn"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Leave Details Modal */}
      {selectedLeave && (
        <div className="lm-modal-overlay">
          <div className="lm-modal-content">
            <div className="lm-modal-header">
              <h2 className="lm-modal-title">
                Leave Request Details
              </h2>
              <button
                onClick={() => setSelectedLeave(null)}
                className="lm-modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="lm-modal-body">
              <div className="lm-modal-grid-2">
                <div>
                  <label className="lm-modal-label">
                    Employee Name
                  </label>
                  <div className="lm-modal-value">
                    {selectedLeave.fullName}
                  </div>
                </div>
                <div>
                  <label className="lm-modal-label">
                    Employee ID
                  </label>
                  <div className="lm-modal-value">
                    {selectedLeave.employeeId}
                  </div>
                </div>
              </div>
              
              <div className="lm-modal-grid-2">
                <div>
                  <label className="lm-modal-label">
                    Position
                  </label>
                  <div className="lm-modal-value-normal">
                    {selectedLeave.positionTitle}
                  </div>
                </div>
                <div>
                  <label className="lm-modal-label">
                    Role
                  </label>
                  <div className="lm-modal-value-normal">
                    {selectedLeave.role}
                  </div>
                </div>
              </div>

              <div>
                <label className="lm-modal-label">
                  Leave Type
                </label>
                <div className="lm-modal-value-normal">
                  {selectedLeave.leaveType}
                </div>
              </div>

              <div className="lm-modal-grid-3">
                <div>
                  <label className="lm-modal-label">
                    Start Date
                  </label>
                  <div className="lm-modal-value-normal">
                    {selectedLeave.startDate}
                  </div>
                </div>
                <div>
                  <label className="lm-modal-label">
                    End Date
                  </label>
                  <div className="lm-modal-value-normal">
                    {selectedLeave.endDate}
                  </div>
                </div>
                <div>
                  <label className="lm-modal-label">
                    Duration
                  </label>
                  <div className="lm-modal-value-normal">
                    {selectedLeave.totalDays} days
                  </div>
                </div>
              </div>

              <div>
                <label className="lm-modal-label">
                  Reason
                </label>
                <div className="lm-modal-textarea">
                  {selectedLeave.reason}
                </div>
              </div>

              <div>
                <label className="lm-modal-label">
                  Work Handover Plan
                </label>
                <div className="lm-modal-textarea">
                  {selectedLeave.handoverNotes || 'N/A'}
                </div>
              </div>

              <div className="lm-modal-grid-2">
                <div>
                  <label className="lm-modal-label">
                    Emergency Contact
                  </label>
                  <div className="lm-modal-value-normal">
                    {selectedLeave.emergencyContactName}
                  </div>
                </div>
                <div>
                  <label className="lm-modal-label">
                    Contact Phone
                  </label>
                  <div className="lm-modal-value-normal">
                    {selectedLeave.emergencyPhone}
                  </div>
                </div>
              </div>

              <div>
                <label className="lm-modal-label">
                  Status
                </label>
                <div className="lm-modal-value-normal">
                  <span className={`lm-status-badge ${getStatusClass(selectedLeave.status)}`}>
                    {selectedLeave.status}
                  </span>
                </div>
              </div>

              {selectedLeave.status.toLowerCase() === 'pending' && (
                <div className="lm-modal-actions">
                  <button
                    onClick={() => {
                      handleApprove(selectedLeave.id);
                      setSelectedLeave(null);
                    }}
                    className="lm-modal-approve-btn"
                  >
                    Approve Leave
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedLeave.id);
                      setSelectedLeave(null);
                    }}
                    className="lm-modal-reject-btn"
                  >
                    Reject Leave
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;