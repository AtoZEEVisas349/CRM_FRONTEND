import React, { useState } from 'react';
import { FaEdit, FaRegCopy } from 'react-icons/fa';

const ClientSetting = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    profession: '',
    location: '',
    bio: '',
    email: '',
    password: '',
    updates: false,
    profileView: false,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Saved successfully!');
    console.log('Saved data:', formData);
  };

  const handleCopyLink = () => {
    const link = "https://www.portfoliolink.com";
    navigator.clipboard.writeText(link);
    alert("Profile link copied!");
  };

  return (
    <div className="process-settings-container">
      <div className="process-breadcrumb">Home / Settings</div>
      <div className="process-settings-wrapper">
        {/* Sidebar */}
        <div className="process-sidebar">
          <h2 className="process-sidebar-heading">Settings</h2>
          <div className="process-profile-card">
            <div className="process-avatar-wrapper">
              <div className="process-avatar-circle">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <label htmlFor="profile-upload" className="process-edit-icon">
                <FaEdit />
              </label>
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            <h3 className="process-profile-name">Jay Rutherford</h3>
            <p className="process-profile-title">Professional title</p>
            <p className="process-profile-desc">
              Creative designer passionate about clean UI and user experience.
            </p>

            <div className="process-link-section">
              <hr className="process-divider" />
              <label>Profile Link</label>
              <div className="process-link-box">
                <input type="text" value="https://www.portfoliolink.com" readOnly />
                <FaRegCopy className="process-copy-icon" onClick={handleCopyLink} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="process-main-content">
          <div className="process-tab-bar">
            <span className="active">General</span>
            <span>Notifications</span>
            <span>Members</span>
            <span>Billings</span>
            <span>Language & Region</span>
            <span>Security</span>
          </div>

          <form className="process-settings-form" onSubmit={handleSubmit}>
            <section>
              <h4>Profile</h4>
              <div className="process-row">
                <div className="process-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="process-field">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Your username"
                  />
                </div>
              </div>

              <div className="process-field">
                <label>Profession</label>
                <select name="profession" value={formData.profession} onChange={handleChange}>
                  <option>Select your title</option>
                  <option>UI/UX Designer</option>
                  <option>Developer</option>
                  <option>Manager</option>
                </select>
              </div>

              <div className="process-field">
                <label>Location</label>
                <select name="location" value={formData.location} onChange={handleChange}>
                  <option>Select your location</option>
                  <option>Hyderabad</option>
                  <option>Delhi</option>
                  <option>Bangalore</option>
                </select>
              </div>

              <div className="process-field">
                <label>Bio</label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Short bio here"
                />
              </div>

              <h4>Account</h4>
              <div className="process-row">
                <div className="process-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                  />
                </div>
                <div className="process-field">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="password"
                  />
                </div>
              </div>

              <h4>Preferences</h4>
              <label className="process-checkbox">
                <input
                  type="checkbox"
                  name="updates"
                  checked={formData.updates}
                  onChange={handleChange}
                />
                Receive monthly product updates
                <span>Get emails about new features and what we’re building.</span>
              </label>

              <label className="process-checkbox">
                <input
                  type="checkbox"
                  name="profileView"
                  checked={formData.profileView}
                  onChange={handleChange}
                />
                Show others when I view their profile
                <span>We’ll let others know when you look at their profile.</span>
              </label>
            </section>

            <button type="submit" className="process-save-btn">Save Information</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientSetting;
