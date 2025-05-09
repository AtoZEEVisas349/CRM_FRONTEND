import React, { useState, useContext } from "react";
import { uploadFile } from "../../services/fileUpload";
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a valid CSV or Excel file");
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      setError("");
      const response = await uploadFileAPI(file);
      setSuccess("File uploaded successfully!");
      setFile(null);
      document.getElementById("file-upload").value = ""; // Reset file input
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    
<div className={`assign-task-container ${isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`} data-theme={theme}>
<SidebarToggle />
      <div className="assign-task-content">
        <div className="background-text">AtoZeeVisas</div>
        <div className="assign-task-glass-card">
          <h2>Upload Task File</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          
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
      color={theme === 'dark' ? '#f0f0f0' : '#333333'} /* Explicit icon color */
    />
    <span className="upload-text">
      {file ? file.name : "Drag & drop or click to browse"}
    </span>
    {file && (
      <span className="file-size" style={{color: theme === 'dark' ? '#d1d1d1' : '#666666'}}>
        {(file.size / 1024).toFixed(2)} KB
      </span>
    )}
  </label>
</div>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;