import React, { useState, useRef } from 'react';

function ClientUpload() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    newFiles.forEach((file) => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const curr = prev[file.name] || 0;
          const next = Math.min(curr + 5, 100);
          if (next === 100) clearInterval(interval);
          return { ...prev, [file.name]: next };
        });
      }, 300);
    });
  };

  const handleRemove = (name) => {
    setFiles(files.filter((file) => file.name !== name));
    setProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[name];
      return newProgress;
    });
  };

  const triggerBrowse = () => {
    inputRef.current.click();
  };

  return (
    <div className="process-container">
      <h1>Upload Your Files</h1>
      <p className="process-subtext">Supports images, PDFs, videos & text. Max size: 10MB.</p>

      <div className="process-upload-box">
        <div className="process-drop-zone">
          <p>Drag & drop files here</p>
          <span>OR</span>
          <input
            type="file"
            multiple
            ref={inputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button onClick={triggerBrowse}>Browse Files</button>
        </div>
      </div>

      <div className="process-file-list">
        {files.map((file) => (
          <div key={file.name} className="process-file-item">
            <span className="process-file-name">{file.name}</span>
            <div className="process-progress-bar">
              <div
                className="process-progress"
                style={{ width: `${progress[file.name] || 0}%` }}
              ></div>
            </div>
            {progress[file.name] === 100 ? (
              <>
                <span className="process-check">✔</span>
                {file.type.startsWith("image/") && (
                  <button
                    className="process-open-btn"
                    onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                  >
                    Open
                  </button>
                )}
              </>
            ) : (
              <button onClick={() => handleRemove(file.name)} className="process-crossmark">✕</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientUpload;
