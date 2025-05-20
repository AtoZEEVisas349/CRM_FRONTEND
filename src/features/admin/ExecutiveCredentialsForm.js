import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, faTimes, faEye, faEyeSlash, faUser, faEnvelope, 
  faPhone, faBuilding, faCalendar, faChevronDown, 
  faBriefcase, faCheck 
} from '@fortawesome/free-solid-svg-icons';


const ExecutiveCredentialsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    accessLevel: 'manager',
    password: '',
    confirmPassword: '',
    startDate: '',
    profileImage: null
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const accessLevelOptions = [
    { value: 'executive', label: 'Executive (Read-only access)' },
    { value: 'admin', label: 'Admin (Full access)' },
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
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (basic)
    if (formData.phone && !/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Position and department
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    
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
      console.log('Executive Credentials Created:', formData);
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
    <div className="executive-form-container">
      <div className="form-card">
        <div className="form-header">
          <h1>Create Executive Credentials</h1>
          <p>Add a new executive to your CRM with appropriate access permissions</p>
        </div>
        
        {formSubmitted ? (
          <div className="success-message">
            <div className="success-icon">
              <faCheck size={40} />
            </div>
            <h2>Executive Account Created!</h2>
            <p>Credentials have been created successfully and a welcome email has been sent to {formData.email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-section profile-section">
                <h2>Profile Information</h2>
                
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
                    <label className="upload-button" htmlFor="profileImage">
                      Upload Image
                    </label>
                    <input 
                      type="file" 
                      id="profileImage" 
                      name="profileImage" 
                      onChange={handleImageChange}
                      accept="image/*"
                      hidden
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faUser} className="input-icon" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        className={errors.firstName ? 'error' : ''}
                      />
                    </div>
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faUser} className="input-icon" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        className={errors.lastName ? 'error' : ''}
                      />
                    </div>
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@company.com"
                        className={errors.email ? 'error' : ''}
                      />
                    </div>
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faPhone} className="input-icon" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className={errors.phone ? 'error' : ''}
                      />
                    </div>
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faCalendar} className="input-icon" />
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="form-section role-section">
                <h2>Role & Access</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="position">Position</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faBriefcase} className="input-icon" />
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="e.g. Sales Director"
                        className={errors.position ? 'error' : ''}
                      />
                    </div>
                    {errors.position && <span className="error-message">{errors.position}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faBuilding} className="input-icon" />
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="e.g. Sales, Marketing"
                        className={errors.department ? 'error' : ''}
                      />
                    </div>
                    {errors.department && <span className="error-message">{errors.department}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="accessLevel">Access Level</label>
                  <div className="select-wrapper">
                    <select
                      id="accessLevel"
                      name="accessLevel"
                      value={formData.accessLevel}
                      onChange={handleInputChange}
                    >
                      {accessLevelOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
                  </div>
                  <span className="help-text">
                    This determines what information the executive can view and edit in the system
                  </span>
                </div>
                
                <div className="password-section">
                  <h3>Account Security</h3>
                  
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-with-icon password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a secure password"
                        className={errors.password ? 'error' : ''}
                      />
                      <button 
                        type="button" 
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                      </button>
                    </div>
                    {errors.password && <span className="error-message">{errors.password}</span>}
                    <div className="password-strength">
                      <div className="strength-meter">
                        <div 
                          className={`strength-bar ${
                            !formData.password ? '' : 
                            formData.password.length < 8 ? 'weak' : 
                            formData.password.length < 12 ? 'medium' : 'strong'
                          }`}
                          style={{ 
                            width: !formData.password ? '0%' : 
                                   formData.password.length < 8 ? '30%' : 
                                   formData.password.length < 12 ? '70%' : '100%' 
                          }}
                        ></div>
                      </div>
                      <span className="strength-text">
                        {!formData.password ? 'Password strength' : 
                         formData.password.length < 8 ? 'Weak' : 
                         formData.password.length < 12 ? 'Medium' : 'Strong'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-with-icon">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Re-enter your password"
                        className={errors.confirmPassword ? 'error' : ''}
                      />
                    </div>
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button type='reset' className="cancel-button">
                <FontAwesomeIcon icon={faTimes} />
                Reset
              </button>
              <button
                type="submit"
                className={`submit-button ${isLoading ? 'loading' : ''}`}
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
  );
};

export default ExecutiveCredentialsForm;