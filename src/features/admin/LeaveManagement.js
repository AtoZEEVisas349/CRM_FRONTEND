import React, { useState } from 'react';
import { Calendar, User, Clock, CheckCircle, XCircle, Filter, Search, Download, Bell } from 'lucide-react';

const LeaveManagement = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Mock data for leave requests
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP001',
      department: 'Marketing',
      position: 'Senior Marketing Manager',
      leaveType: 'Annual Leave',
      startDate: '2025-07-15',
      endDate: '2025-07-25',
      duration: '11 days',
      reason: 'Family vacation to Europe',
      status: 'pending',
      appliedDate: '2025-06-10',
      reportingManager: 'Michael Brown',
      coverage: 'John Smith will handle ongoing projects'
    },
    {
      id: 2,
      employeeName: 'David Chen',
      employeeId: 'EMP002',
      department: 'Engineering',
      position: 'Software Developer',
      leaveType: 'Sick Leave',
      startDate: '2025-06-22',
      endDate: '2025-06-24',
      duration: '3 days',
      reason: 'Medical procedure',
      status: 'approved',
      appliedDate: '2025-06-20',
      reportingManager: 'Lisa Wang',
      coverage: 'Team will redistribute tasks'
    },
    {
      id: 3,
      employeeName: 'Emily Rodriguez',
      employeeId: 'EMP003',
      department: 'HR',
      position: 'HR Specialist',
      leaveType: 'Maternity Leave',
      startDate: '2025-08-01',
      endDate: '2025-11-01',
      duration: '3 months',
      reason: 'Maternity leave',
      status: 'pending',
      appliedDate: '2025-06-15',
      reportingManager: 'Robert Taylor',
      coverage: 'Temporary replacement hired'
    },
    {
      id: 4,
      employeeName: 'James Wilson',
      employeeId: 'EMP004',
      department: 'Sales',
      position: 'Sales Representative',
      leaveType: 'Personal Leave',
      startDate: '2025-07-01',
      endDate: '2025-07-03',
      duration: '3 days',
      reason: 'Personal matters',
      status: 'rejected',
      appliedDate: '2025-06-18',
      reportingManager: 'Anna Davis',
      coverage: 'N/A'
    }
  ]);

  const handleApprove = (id) => {
    setLeaveRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: 'approved' } : req)
    );
  };

  const handleReject = (id) => {
    setLeaveRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: 'rejected' } : req)
    );
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesFilter = selectedFilter === 'all' || request.status === selectedFilter;
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'approved': return '#d1fae5';
      case 'rejected': return '#fee2e2';
      case 'pending': return '#fef3c7';
      default: return '#f3f4f6';
    }
  };

  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            marginBottom: '0.25rem'
          }}>
            Employee Leave Management
          </h1>
          <p style={{
            color: '#6b7280',
            margin: 0,
            fontSize: '1rem'
          }}>
            Executive Dashboard - Manage and approve employee leave requests
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            position: 'relative',
            padding: '0.5rem',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '12px',
            cursor: 'pointer'
          }}>
            <Bell size={20} color="#667eea" />
            {stats.pending > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>
                {stats.pending}
              </span>
            )}
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}>
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '2rem' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Total Requests', value: stats.total, color: '#3b82f6', icon: Calendar },
            { label: 'Pending Approval', value: stats.pending, color: '#f59e0b', icon: Clock },
            { label: 'Approved', value: stats.approved, color: '#10b981', icon: CheckCircle },
            { label: 'Rejected', value: stats.rejected, color: '#ef4444', icon: XCircle }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                background: `${stat.color}15`,
                borderRadius: '12px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={24} color={stat.color} />
              </div>
              <div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  lineHeight: '1'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  color: '#6b7280',
                  fontSize: '0.9rem',
                  marginTop: '0.25rem'
                }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={20} color="#6b7280" />
            <span style={{ color: '#374151', fontWeight: '600' }}>Filter:</span>
          </div>
          {['all', 'pending', 'approved', 'rejected'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '8px',
                background: selectedFilter === filter 
                  ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                  : 'rgba(107, 114, 128, 0.1)',
                color: selectedFilter === filter ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: '500',
                textTransform: 'capitalize',
                fontSize: '0.9rem'
              }}
            >
              {filter === 'all' ? 'All Requests' : filter}
            </button>
          ))}
          <div style={{
            marginLeft: 'auto',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={18} color="#6b7280" style={{
              position: 'absolute',
              left: '0.75rem',
              zIndex: 1
            }} />
            <input
              type="text"
              placeholder="Search employees, departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: '2.5rem',
                paddingRight: '1rem',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                border: '2px solid rgba(107, 114, 128, 0.1)',
                borderRadius: '10px',
                fontSize: '0.9rem',
                outline: 'none',
                minWidth: '300px',
                background: 'rgba(255, 255, 255, 0.8)'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(107, 114, 128, 0.1)'}
            />
          </div>
        </div>

        {/* Leave Requests Table */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Employee</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Leave Type</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Duration</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Applied Date</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request, index) => (
                  <tr key={request.id} style={{
                    borderBottom: '1px solid rgba(243, 244, 246, 0.8)',
                    '&:hover': { background: 'rgba(102, 126, 234, 0.05)' }
                  }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}>
                          {request.employeeName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1f2937' }}>
                            {request.employeeName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                            {request.department} • {request.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {request.leaveType}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: '#374151', fontWeight: '500' }}>
                        {request.duration}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {request.startDate} to {request.endDate}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        background: getStatusBg(request.status),
                        color: getStatusColor(request.status)
                      }}>
                        {request.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      {request.appliedDate}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => setSelectedLeave(request)}
                          style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            background: 'white',
                            color: '#374151',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}
                        >
                          View
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              style={{
                                padding: '0.5rem 1rem',
                                border: 'none',
                                borderRadius: '8px',
                                background: '#10b981',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              style={{
                                padding: '0.5rem 1rem',
                                border: 'none',
                                borderRadius: '8px',
                                background: '#ef4444',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                              }}
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
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>
                Leave Request Details
              </h2>
              <button
                onClick={() => setSelectedLeave(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                    Employee Name
                  </label>
                  <div style={{ marginTop: '0.25rem', fontWeight: '600' }}>
                    {selectedLeave.employeeName}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                    Employee ID
                  </label>
                  <div style={{ marginTop: '0.25rem', fontWeight: '600' }}>
                    {selectedLeave.employeeId}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                    Department
                  </label>
                  <div style={{ marginTop: '0.25rem' }}>
                    {selectedLeave.department}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                    Position
                  </label>
                  <div style={{ marginTop: '0.25rem' }}>
                    {selectedLeave.position}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                  Leave Type
                </label>
                <div style={{ marginTop: '0.25rem' }}>
                  {selectedLeave.leaveType}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                    Start Date
                  </label>
                  <div style={{ marginTop: '0.25rem' }}>
                    {selectedLeave.startDate}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                    End Date
                  </label>
                  <div style={{ marginTop: '0.25rem' }}>
                    {selectedLeave.endDate}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                    Duration
                  </label>
                  <div style={{ marginTop: '0.25rem' }}>
                    {selectedLeave.duration}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                  Reason
                </label>
                <div style={{
                  marginTop: '0.25rem',
                  padding: '0.75rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  {selectedLeave.reason}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                  Work Coverage Plan
                </label>
                <div style={{
                  marginTop: '0.25rem',
                  padding: '0.75rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  {selectedLeave.coverage}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                    Reporting Manager
                  </label>
                  <div style={{ marginTop: '0.25rem' }}>
                    {selectedLeave.reportingManager}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                    Status
                  </label>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      background: getStatusBg(selectedLeave.status),
                      color: getStatusColor(selectedLeave.status)
                    }}>
                      {selectedLeave.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedLeave.status === 'pending' && (
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <button
                    onClick={() => {
                      handleApprove(selectedLeave.id);
                      setSelectedLeave(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#10b981',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Approve Leave
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedLeave.id);
                      setSelectedLeave(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#ef4444',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
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

