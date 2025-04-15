import React, { useState,useEffect,useContext } from "react";
import { uploadFile } from "../../services/fileUpload";
import { useApi } from "../../context/ApiContext";
import { ThemeContext } from "../../features/admin/ThemeContext";



const AssignTask = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { theme } = useContext(ThemeContext);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const { uploadFileAPI, uploadError, uploadSuccess } = useApi();

  const handleUpload = async () => {
    try {
      await uploadFileAPI(file);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="assign-task-container">
      <div className="background-text">AtoZeeVisas</div>
      <div className="assign-task">
        <h2>Upload File</h2>

        {/* Display error message */}
        {uploadError && <p className="error-message">{error}</p>}

        {/* Display success message */}
        {uploadSuccess && <p className="success-message">{success}</p>}

        <input type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default AssignTask;