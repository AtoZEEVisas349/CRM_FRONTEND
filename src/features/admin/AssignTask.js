import React, { useState } from "react";
import { uploadFile } from "../../services/fileUpload";

const AssignTask = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first!");
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const response = await uploadFile(file); // Call API function
      setSuccess("File uploaded successfully!");
      console.log("Upload Response:", response);
    } catch (err) {
      setError(err.message || "File upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="assign-task-container">
      <div className="background-text">AtoZeeVisas</div>
      <div className="assign-task">
        <h2>Upload File</h2>

        {/* Display error message */}
        {error && <p className="error-message">{error}</p>}

        {/* Display success message */}
        {success && <p className="success-message">{success}</p>}

        <input type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default AssignTask;
