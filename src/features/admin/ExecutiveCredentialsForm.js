import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SidebarToggle from "./SidebarToggle";

import {
  faSave,
  faTimes,
  faEye,
  faEyeSlash,
  faUser,
  faEnvelope,
  faPhone,
  faBuilding,
  faCalendar,
  faChevronDown,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";

const ExecutiveCredentialsForm = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("adminSidebarExpanded") === "false"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    accessLevel: "manager",
    password: "",
    confirmPassword: "",
    startDate: "",
    profileImage: null,
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const isSidebarExpanded =
    localStorage.getItem("adminSidebarExpanded") === "true";

  const accessLevelOptions = [
    { value: "executive", label: "Executive (Read-only access)" },
    { value: "admin", label: "Admin (Full access)" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (basic)
    if (formData.phone && !/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Position and department
    if (!formData.position.trim()) newErrors.position = "Position is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setFormSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`create-executive-container ${
        sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
      }`}
    >
      <SidebarToggle />

      <div className="executive-form-container">
        <div className="form-card">
          <div className="form-header">
            <h1>Create Executive Credentials</h1>
            <p>
              Add a new executive to your CRM with appropriate access
              permissions
            </p>
          </div>

          {formSubmitted ? (
            <div className="success-message">
              <div className="success-icon">
                <faCheck size={40} />
              </div>
              <h2>Executive Account Created!</h2>
              <p>
                Credentials have been created successfully and a welcome email
                has been sent to {formData.email}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-section profile-section">
                <h2>Executive Information</h2>
          
                <div className="profile-upload">
                  <div className="form-profile-image">
                    {previewImage ? (
                      <img src={previewImage} alt="Profile preview" />
                    ) : (
                      <div className="profile-placeholder">
                        <FontAwesomeIcon icon={faUser} size="2x" />
                      </div>
                    )}
                  </div>
                  <div className="upload-controls">
                    <h3>Profile Photo</h3>
                    <p>Upload a professional profile photo (optional)</p>
                    <label className="upload-button" htmlFor="profile_picture">Upload Image</label>
                    <input
                      type="file"
                      id="profile_picture"
                      name="profile_picture"
                      onChange={handleImageChange}
                      accept="image/*"
                      hidden
                    />
                  </div>
                </div>
          
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faUser} className="input-icon" />
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        required
                      />
                    </div>
                  </div>
          
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@domain.com"
                        required
                      />
                    </div>
                  </div>
                </div>
          
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstname">First Name</label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      placeholder="First name"
                    />
                  </div>
          
                  <div className="form-group">
                    <label htmlFor="lastname">Last Name</label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      placeholder="Last name"
                    />
                  </div>
                </div>
          
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="e.g., India"
                    />
                  </div>
          
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g., Delhi"
                    />
                  </div>
                </div>
          
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g., Haryana"
                    />
                  </div>
          
                  <div className="form-group">
                    <label htmlFor="postal_code">Postal Code</label>
                    <input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      placeholder="e.g., 110001"
                    />
                  </div>
                </div>
          
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="team_id">Team ID</label>
                    <input
                      type="text"
                      id="team_id"
                      name="team_id"
                      value={formData.team_id}
                      onChange={handleInputChange}
                      placeholder="Team ID"
                    />
                  </div>
          
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                </div>
          
                <div className="form-row">
                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label htmlFor="password">Password</label>
                    <div className="input-with-icon password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a secure password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <FontAwesomeIcon icon={faEyeSlash} />
                        ) : (
                          <FontAwesomeIcon icon={faEye} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
            <div className="form-actions">
              <button type="reset" className="cancel-button">
                <FontAwesomeIcon icon={faTimes} />
                Reset
              </button>
              <button
                type="submit"
                className={`submit-button ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} />
                    Create Executive Account
                  </>
                )}
              </button>
            </div>
          </form>
          
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveCredentialsForm;