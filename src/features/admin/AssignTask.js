
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

  const isSidebarExpanded =
    localStorage.getItem("adminSidebarExpanded") === "true";

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
      className={`assign-task-container ${
        isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
      data-theme={theme}
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <SidebarToggle />

      <div
        className="assign-task-content"
        style={{ width: "100%", maxWidth: "600px" }}
      >
        <div
          className="background-text"
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          AtoZeeVisas
        </div>

        <div
          className="assign-task-glass-card"
          style={{
            backdropFilter: "blur(15px) saturate(150%)",
            background:
              theme === "dark"
                ? "linear-gradient(135deg, rgba(50, 50, 50, 0.4), rgba(80, 80, 80, 0.2))"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(240, 240, 240, 0.5))",
            padding: "40px 30px",
            borderRadius: "24px",
            boxShadow:
              theme === "dark"
                ? "0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)"
                : "0 10px 30px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.8)",
            border:
              theme === "dark"
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : "1px solid rgba(0, 0, 0, 0.1)",
            width: "100%",
            boxSizing: "border-box",
            transition: "all 0.3s ease",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "25px",
              fontSize: "1.8rem",
              fontWeight: "600",
              color: theme === "dark" ? "#f0f0f0" : "#222222",
            }}
          >
            Upload Task File
          </h2>

          {error && (
            <p className="error-message" style={{ color: "red" }}>
              {error}
            </p>
          )}
          {success && (
            <p className="success-message" style={{ color: "green" }}>
              {success}
            </p>
          )}

          <div className="upload-box" style={{ marginBottom: "15px" }}>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".csv, .xlsx, .xls"
              disabled={uploading}
              style={{ display: "none" }}
            />
            <label
              htmlFor="file-upload"
              className="upload-label"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #ccc",
                padding: "20px",
                cursor: "pointer",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <FontAwesomeIcon
                icon={uploading ? faSpinner : faCloudUploadAlt}
                spin={uploading}
                className="upload-icon"
                color={theme === "dark" ? "#f0f0f0" : "#333333"}
                size="2x"
              />
              <span
                className="upload-text"
                style={{ marginTop: "10px", fontWeight: "500" }}
              >
                {file ? file.name : "Drag & drop or click to browse"}
              </span>
              {file && (
                <span
                  className="file-size"
                  style={{
                    marginTop: "5px",
                    fontSize: "0.85em",
                    color: theme === "dark" ? "#d1d1d1" : "#666666",
                  }}
                >
                  {(file.size / 1024).toFixed(2)} KB
                </span>
              )}
            </label>
          </div>

          <button
            onClick={handleUpload}
            className="upload-button"
            disabled={uploading || !file}
            style={{
              width: "100%",
              padding: "14px 20px",
              fontSize: "1.1rem",
              fontWeight: "600",
              border: "none",
              borderRadius: "12px",
              cursor: uploading || !file ? "not-allowed" : "pointer",
              background:
                uploading || !file
                  ? "linear-gradient(135deg, #888, #aaa)"
                  : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              boxShadow:
                uploading || !file
                  ? "none"
                  : "0 4px 15px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseOver={(e) => {
              if (!uploading && file) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(102, 126, 234, 0.5)";
              }
            }}
            onMouseOut={(e) => {
              if (!uploading && file) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            {uploading ? "Uploading..." : "🚀 Upload File"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;

