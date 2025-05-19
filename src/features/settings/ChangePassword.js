import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaUserShield } from "react-icons/fa";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible({
      ...passwordVisible,
      [field]: !passwordVisible[field],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
    } else {
      alert("Password changed successfully!");
      // Add your API logic here
    }
  };

  return (
    <div className="change-password">

<div className="contact-admin-container" >
  <div className="contact-admin-box">
      <FaUserShield className="admin-icon" />
  <p className="change-password-text">Contact to Administrater for changing the password</p>
 
</div>
</div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} className="password-form">
        <div className="input-container">
          <input
            type={passwordVisible.currentPassword ? "text" : "password"}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter your current password"
          />
         
          <span
            className="password-icon"
            onClick={() => togglePasswordVisibility("currentPassword")}
          >
            {passwordVisible.currentPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="input-container">
          <input
            type={passwordVisible.newPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter a new password"
          />
         
          <span
            className="password-icon"
            onClick={() => togglePasswordVisibility("newPassword")}
          >
            {passwordVisible.newPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="input-container">
          <input
            type={passwordVisible.confirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your new password"
          />
          {/* <label>
            <FaKey />
            Confirm New Password
          </label> */}
          <span
            className="password-icon"
            onClick={() => togglePasswordVisibility("confirmPassword")}
          >
            {passwordVisible.confirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
