import React, { useState } from 'react';
import { Users, UserPlus, Search, Filter, MoreVertical, Star, MessageCircle, Phone, Mail, Activity } from 'lucide-react';
import '../../styles/crm-teams.css';

const Team = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Sample data - replace with your actual data
  const teams = [
    {
      id: 1,
      name: 'Sales Champions',
      description: 'High-performing sales professionals driving revenue growth',
      color: 'crm-gradient-purple-pink',
      performance: 94,
      members: [
        { id: 1, name: 'Alex Rivera', role: 'Team Lead', avatar: '🚀', status: 'online', deals: 23, revenue: '$125K' },
        { id: 2, name: 'Sarah Chen', role: 'Senior Sales Rep', avatar: '⭐', status: 'online', deals: 18, revenue: '$98K' },
        { id: 3, name: 'Mike Johnson', role: 'Sales Rep', avatar: '💼', status: 'away', deals: 12, revenue: '$67K' },
        { id: 4, name: 'Emma Davis', role: 'Sales Rep', avatar: '🎯', status: 'online', deals: 15, revenue: '$78K' }
      ]
    },
    {
      id: 2,
      name: 'Marketing Mavericks',
      description: 'Creative minds crafting compelling campaigns and strategies',
      color: 'crm-gradient-blue-cyan',
      performance: 87,
      members: [
        { id: 5, name: 'David Park', role: 'Marketing Director', avatar: '🎨', status: 'online', deals: 8, revenue: '$45K' },
        { id: 6, name: 'Lisa Wang', role: 'Content Strategist', avatar: '✨', status: 'online', deals: 6, revenue: '$32K' },
        { id: 7, name: 'Tom Wilson', role: 'Digital Marketer', avatar: '📊', status: 'offline', deals: 4, revenue: '$21K' }
      ]
    },
    {
      id: 3,
      name: 'Support Heroes',
      description: 'Dedicated customer success specialists ensuring client satisfaction',
      color: 'crm-gradient-green-emerald',
      performance: 96,
      members: [
        { id: 8, name: 'Rachel Green', role: 'Support Manager', avatar: '🛠️', status: 'online', deals: 0, revenue: '$0' },
        { id: 9, name: 'James Brown', role: 'Support Specialist', avatar: '🔧', status: 'online', deals: 0, revenue: '$0' },
        { id: 10, name: 'Anna Lee', role: 'Customer Success', avatar: '💫', status: 'away', deals: 3, revenue: '$15K' }
      ]
    },
    {
      id: 4,
      name: 'Product Innovators',
      description: 'Visionary product managers and developers shaping the future',
      color: 'crm-gradient-orange-red',
      performance: 91,
      members: [
        { id: 11, name: 'Chris Taylor', role: 'Product Manager', avatar: '🧠', status: 'online', deals: 2, revenue: '$120K' },
        { id: 12, name: 'Maya Patel', role: 'UX Designer', avatar: '🎭', status: 'online', deals: 1, revenue: '$85K' }
      ]
    }
  ];

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.members.some(member => member.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'crm-status-online';
      case 'away': return 'crm-status-away';
      case 'offline': return 'crm-status-offline';
      default: return 'crm-status-offline';
    }
  };

  return (
    <div className="crm-teams-container">
      {/* Header */}
      <div className="crm-teams-header">
        <div className="crm-teams-header-top">
          <div>
            <h1 className="crm-teams-title">
              Team Manager
            </h1>
            <p className="crm-teams-subtitle">Manage your teams and track performance</p>
          </div>
          <button className="crm-btn-primary crm-btn-add-team">
            <UserPlus size={20} />
            Add Team
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="crm-search-filter-bar">
          <div className="crm-search-container">
            <Search className="crm-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search teams or members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="crm-search-input"
            />
          </div>
          <select 
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="crm-filter-select"
          >
            <option value="all">All Teams</option>
            <option value="high">High Performance</option>
            <option value="medium">Medium Performance</option>
            <option value="low">Low Performance</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="crm-stats-grid">
          <div className="crm-stat-card">
            <div className="crm-stat-content">
              <div>
                <p className="crm-stat-label">Total Teams</p>
                <p className="crm-stat-value">{teams.length}</p>
              </div>
              <Users className="crm-stat-icon crm-icon-purple" size={24} />
            </div>
          </div>
          <div className="crm-stat-card">
            <div className="crm-stat-content">
              <div>
                <p className="crm-stat-label">Total Members</p>
                <p className="crm-stat-value">{teams.reduce((acc, team) => acc + team.members.length, 0)}</p>
              </div>
              <Activity className="crm-stat-icon crm-icon-blue" size={24} />
            </div>
          </div>
          <div className="crm-stat-card">
            <div className="crm-stat-content">
              <div>
                <p className="crm-stat-label">Avg Performance</p>
                <p className="crm-stat-value">{Math.round(teams.reduce((acc, team) => acc + team.performance, 0) / teams.length)}%</p>
              </div>
              <Star className="crm-stat-icon crm-icon-yellow" size={24} />
            </div>
          </div>
          <div className="crm-stat-card">
            <div className="crm-stat-content">
              <div>
                <p className="crm-stat-label">Online Now</p>
                <p className="crm-stat-value">
                  {teams.reduce((acc, team) => acc + team.members.filter(m => m.status === 'online').length, 0)}
                </p>
              </div>
              <div className="crm-online-indicator"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="crm-teams-grid">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="crm-team-card"
          >
            {/* Team Header */}
            <div className={`crm-team-header ${team.color}`}>
              <div className="crm-team-header-overlay"></div>
              <div className="crm-team-header-content">
                <div className="crm-team-header-top">
                  <h3 className="crm-team-name">{team.name}</h3>
                  <button className="crm-team-menu-btn">
                    <MoreVertical size={20} />
                  </button>
                </div>
                <p className="crm-team-description">{team.description}</p>
                <div className="crm-team-info">
                  <div className="crm-team-members-count">
                    <Users className="crm-team-icon" size={16} />
                    <span className="crm-team-members-text">{team.members.length} members</span>
                  </div>
                  <div className="crm-team-performance">
                    <div className="crm-performance-bar">
                      <div 
                        className="crm-performance-fill"
                        style={{ width: `${team.performance}%` }}
                      ></div>
                    </div>
                    <span className="crm-performance-text">{team.performance}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="crm-team-body">
              <div className="crm-members-list">
                {team.members.map((member) => (
                  <div
                    key={member.id}
                    className="crm-member-item"
                  >
                    <div className="crm-member-info">
                      <div className="crm-member-avatar-container">
                        <div className="crm-member-avatar">
                          {member.avatar}
                        </div>
                        <div className={`crm-member-status ${getStatusColor(member.status)}`}></div>
                      </div>
                      <div>
                        <p className="crm-member-name">{member.name}</p>
                        <p className="crm-member-role">{member.role}</p>
                      </div>
                    </div>
                    <div className="crm-member-actions">
                      <button className="crm-action-btn">
                        <MessageCircle size={16} />
                      </button>
                      <button className="crm-action-btn">
                        <Phone size={16} />
                      </button>
                      <button className="crm-action-btn">
                        <Mail size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Team Actions */}
              <div className="crm-team-actions">
                <div className="crm-team-buttons">
                  <button className="crm-btn-secondary crm-btn-view">
                    View Details
                  </button>
                  <button className="crm-btn-secondary crm-btn-manage">
                    Manage Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="crm-fab">
        <UserPlus size={24} />
      </button>
    </div>
  );
};

export default Team;