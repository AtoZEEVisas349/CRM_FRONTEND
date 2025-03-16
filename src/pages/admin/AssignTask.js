import React, { useState } from "react";
import axios from "axios";

const AssignTask = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/client-leads/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(response.data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed!");
    }
  };

  return (
    <div className="assign-task-container">
      <div className="background-text">AtoZeeVisas</div>
      <div className="assign-task">
        <h2>Upload File</h2>
        <input type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
};

export default AssignTask;
