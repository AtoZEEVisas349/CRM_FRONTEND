import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import "../../styles/payroll.css";

const PayrollSystem = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');

  // Sample employee data
  const employees = [
    {
      id: 'EMP001',
      name: 'John Smith',
      designation: 'Senior Developer',
      attendance: '22/22',
      grossSalary: 85000,
      deductions: 8500,
      netSalary: 76500
    },
    {
      id: 'EMP002',
      name: 'Sarah Johnson',
      designation: 'Project Manager',
      attendance: '21/22',
      grossSalary: 95000,
      deductions: 9500,
      netSalary: 85500
    },
    {
      id: 'EMP003',
      name: 'Michael Brown',
      designation: 'UI/UX Designer',
      attendance: '20/22',
      grossSalary: 65000,
      deductions: 6500,
      netSalary: 58500
    },
    {
      id: 'EMP004',
      name: 'Emily Davis',
      designation: 'QA Engineer',
      attendance: '22/22',
      grossSalary: 55000,
      deductions: 5500,
      netSalary: 49500
    },
    {
      id: 'EMP005',
      name: 'David Wilson',
      designation: 'Backend Developer',
      attendance: '19/22',
      grossSalary: 75000,
      deductions: 7500,
      netSalary: 67500
    },
    {
      id: 'EMP006',
      name: 'Lisa Anderson',
      designation: 'HR Manager',
      attendance: '21/22',
      grossSalary: 70000,
      deductions: 7000,
      netSalary: 63000
    }
  ];

  const designations = [...new Set(employees.map(emp => emp.designation))];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDesignation = filterDesignation === '' || employee.designation === filterDesignation;
    return matchesSearch && matchesDesignation;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getAttendanceStatus = (attendance) => {
    const [present, total] = attendance.split('/').map(Number);
    const percentage = (present / total) * 100;
    
    if (percentage >= 95) return 'excellent';
    if (percentage >= 85) return 'good';
    if (percentage >= 75) return 'average';
    return 'poor';
  };

  const totalGrossSalary = filteredEmployees.reduce((sum, emp) => sum + emp.grossSalary, 0);
  const totalDeductions = filteredEmployees.reduce((sum, emp) => sum + emp.deductions, 0);
  const totalNetSalary = filteredEmployees.reduce((sum, emp) => sum + emp.netSalary, 0);

  return (
    <div className="payroll-container">
      <div className="header">
        <h1>Employee Payroll Management</h1>
        <div className="header-actions">
          <button className="btn btn-primary">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <p className="stat-value">{filteredEmployees.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Gross Salary</h3>
          <p className="stat-value text-green">{formatCurrency(totalGrossSalary)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Deductions</h3>
          <p className="stat-value text-red">{formatCurrency(totalDeductions)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Net Salary</h3>
          <p className="stat-value text-blue">{formatCurrency(totalNetSalary)}</p>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <Filter size={20} />
          <select
            value={filterDesignation}
            onChange={(e) => setFilterDesignation(e.target.value)}
          >
            <option value="">All Designations</option>
            {designations.map(designation => (
              <option key={designation} value={designation}>{designation}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Attendance</th>
              <th>Gross Salary</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td className="employee-id">{employee.id}</td>
                <td className="employee-name">{employee.name}</td>
                <td>
                  <span className="designation-badge">{employee.designation}</span>
                </td>
                <td>
                  <span className={`attendance-badge ${getAttendanceStatus(employee.attendance)}`}>
                    {employee.attendance}
                  </span>
                </td>
                <td className="salary-cell text-green">
                  {formatCurrency(employee.grossSalary)}
                </td>
                <td className="salary-cell text-red">
                  {formatCurrency(employee.deductions)}
                </td>
                <td className="salary-cell text-blue font-bold">
                  {formatCurrency(employee.netSalary)}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="View Details">
                      <Eye size={16} />
                    </button>
                    <button className="btn-icon" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon delete" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="empty-state">
          <p>No employees found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default PayrollSystem;