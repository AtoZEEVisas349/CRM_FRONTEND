import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaUserShield } from "react-icons/fa";
import BlurOverlay from "../../features/Invoice/BlurOverlay";

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
  const [isLoading, setIsLoading] = useState(true); // Add loading state

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
      <style>
        {`/* Responsive adjustments for Change Password */
.change-password {
  max-width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.input-container {
  position: relative;
  width: 100%;
}

.input-container input {
  width: 100%;
  padding: 12px 40px 12px 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.password-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

@media (max-width: 768px) {
  .password-form {
    padding: 0 10px;
  }
}
`}
      </style>
      <div className="contact-admin-container">
        <div className="contact-admin-box">
          <FaUserShield className="admin-icon" />
          <p className="change-password-text">
            Contact to Administrater for changing the password
          </p>
        </div>
      </div>

      <h2>Change Password</h2>

      {/* Wrap the form section with BlurOverlay */}
      <BlurOverlay isLoading={isLoading}>
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
            <span
              className="password-icon"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {passwordVisible.confirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Update Password</button>
        </form>
      </BlurOverlay>
    </div>
  );
};

export default ChangePassword;