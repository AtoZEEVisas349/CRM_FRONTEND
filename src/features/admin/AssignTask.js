import React, { useState, useContext } from "react";
import { useApi } from "../../context/ApiContext";
import { ThemeContext } from "../../features/admin/ThemeContext";
import SidebarToggle from "./SidebarToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faSpinner } from "@fortawesome/free-solid-svg-icons";

const AssignTask = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { theme } = useContext(ThemeContext);
  const { uploadFileAPI } = useApi();

  const isSidebarExpanded = localStorage.getItem("adminSidebarExpanded") === "true";

  // ----------------------------
  // File Change Handler
  // ----------------------------
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (selectedFile) {
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a valid CSV or Excel file");
        setFile(null);
      }
    }
  };

  // ----------------------------
  // Upload Handler
  // ----------------------------
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const response = await uploadFileAPI(file);
      setSuccess("File uploaded successfully!");
      setFile(null);
      document.getElementById("file-upload").value = "";
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`assign-task-container ${isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}
      data-theme={theme}
    >
      <SidebarToggle />

      <div className="assign-task-content">
        <div className="background-text">AtoZeeVisas</div>

        <div className="assign-task-glass-card">
          <h2>Upload Task File</h2>

          {/* Status Messages */}
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          {/* File Upload Box */}
          <div className="upload-box">
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".csv, .xlsx, .xls"
              disabled={uploading}
            />
            <label htmlFor="file-upload" className="upload-label">
              <FontAwesomeIcon
                icon={uploading ? faSpinner : faCloudUploadAlt}
                spin={uploading}
                className="upload-icon"
                color={theme === "dark" ? "#f0f0f0" : "#333333"}
              />
              <span className="upload-text">
                {file ? file.name : "Drag & drop or click to browse"}
              </span>
              {file && (
                <span
                  className="file-size"
                  style={{ color: theme === "dark" ? "#d1d1d1" : "#666666" }}
                >
                  {(file.size / 1024).toFixed(2)} KB
                </span>
              )}
            </label>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="upload-button"
            disabled={uploading || !file}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: theme === "dark" ? "#444" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: uploading || !file ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;
