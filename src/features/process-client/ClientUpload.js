
import React, { useState, useEffect, useRef } from "react";
import { useProcessService } from "../../context/ProcessServiceContext";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye,faXmark} from '@fortawesome/free-solid-svg-icons';

const ClientUpload = () => {
  const { uploadDocs, getDocumentsApi } = useProcessService();
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [message, setMessage] = useState("");
  const [customerId, setCustomerId] = useState("");
  const inputRef = useRef();
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [customerDocs, setCustomerDocs] = useState([]);
  const [processDocs, setProcessDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const normalizedType =
          parsedUser.type === "processperson" ? "process_person" : parsedUser.type;

        const updatedUser = { ...parsedUser, type: normalizedType };
        setUserDetails(updatedUser);

        if (normalizedType === "customer") {
          setCustomerId(parsedUser.id);
          fetchDocs(parsedUser.id);
        } else {
          setCustomerId(id);
          fetchDocs(id);
        }
      } catch (err) {
        console.error("Invalid user object in localStorage", err);
      }
    }
  }, [id]);

const fetchDocs = async () => {
  if (!customerId) return;
  setLoading(true);

  try {
    // Run both API calls in parallel
    const [customerResult, processResult] = await Promise.allSettled([
      getDocumentsApi("customer", customerId),
      getDocumentsApi("process_person", customerId),
    ]);

    if (customerResult.status === "fulfilled" && Array.isArray(customerResult.value)) {
      setCustomerDocs([...customerResult.value].sort((a, b) => b.id - a.id));
    } else {
      console.warn("Customer docs failed to load");
      setCustomerDocs([]);  // Ensure table renders empty if fail
    }

    if (processResult.status === "fulfilled" && Array.isArray(processResult.value)) {
      setProcessDocs([...processResult.value].sort((a, b) => b.id - a.id));
    } else {
      console.warn("Process docs failed to load");
      setProcessDocs([]);  // Ensure table renders empty if fail
    }

  } catch (err) {
    console.error("Unexpected error:", err);
    setCustomerDocs([]);
    setProcessDocs([]);
    setError("Something went wrong.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (customerId) {
      fetchDocs();
    }
  }, [customerId]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!customerId) {
      setMessage("Customer ID not found.");
      return;
    }

    if (!userDetails?.type) {
      setMessage("User type not found.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("customerId", customerId);
      formData.append("userType", userDetails.type);

      files.forEach((file) => {
        formData.append("documents", file);
      });

      const result = await uploadDocs(formData);
      setMessage(result.message || "Documents uploaded successfully");
      setFiles([]);
      setProgress({});
      await fetchDocs();

      setTimeout(() => {
        setMessage("");
      }, 100);
    } catch (err) {
      console.error("Upload failed", err);
      setMessage("Upload failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setCustomerId(id);
    }
  }, [id]);

  const renderTable = (docs, title) => (
    <>
      <h2>{title}</h2>
      <table className="uploaded-docs-table">
        <thead className="thead">
          <tr>
            <th>Document ID</th>
            <th>Document Name</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(docs) && docs.length > 0 ? (
            docs.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.documentName}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => {
                      const byteCharacters = atob(doc.base64Data);
                      const byteNumbers = Array.from(byteCharacters).map((char) =>
                        char.charCodeAt(0)
                      );
                      const byteArray = new Uint8Array(byteNumbers);
                      const blob = new Blob([byteArray], { type: doc.mimeType });
                      const blobUrl = URL.createObjectURL(blob);
                      window.open(blobUrl, "_blank");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                    title="Preview"
                  >
                    <FontAwesomeIcon icon={faEye} style={{ color: 'black', fontSize: '12px' }} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "10px" }}>
                No documents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );

  return (
    <div>
 {loading && (
  <div className="loader-container">
    <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
      <circle
        className="pl__ring pl__ring--a"
        cx="120"
        cy="120"
        r="105"
        fill="none"
        stroke="#000"
        strokeWidth="20"
        strokeDasharray="0 660"
        strokeDashoffset="-330"
        strokeLinecap="round"
      ></circle>
      <circle
        className="pl__ring pl__ring--b"
        cx="120"
        cy="120"
        r="35"
        fill="none"
        stroke="#000"
        strokeWidth="20"
        strokeDasharray="0 220"
        strokeDashoffset="-110"
        strokeLinecap="round"
      ></circle>
      <circle
        className="pl__ring pl__ring--c"
        cx="85"
        cy="120"
        r="70"
        fill="none"
        stroke="#000"
        strokeWidth="20"
        strokeDasharray="0 440"
        strokeLinecap="round"
      ></circle>
      <circle
        className="pl__ring pl__ring--d"
        cx="155"
        cy="120"
        r="70"
        fill="none"
        stroke="#000"
        strokeWidth="20"
        strokeDasharray="0 440"
        strokeLinecap="round"
      ></circle>
    </svg>
  </div>
)}



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
            <button type="button" onClick={triggerBrowse}>Browse Files</button>
          </div>
        </div>

        <form onSubmit={handleUpload} encType="multipart/form-data">
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
             {/* {file.type.startsWith("image/") && ( */}
             <button
                        className="process-open-btn"
                        type="submit"
                      >
                        Submit
                      </button>
                    {/* )} */}
                     <button
                      type="button"
                      onClick={() => handleRemove(file.name)}
                      className="process-delete-btn"
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "transparent",
                        border: "none",
                        color: "red",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                      title="Delete file"
                    >
                      <FontAwesomeIcon icon={faTrash} style={{ 
    color: 'red', 
    paddingLeft: '10px',
    border: '2px solid #1976d2',
    borderRadius: '4px',      // Adjust radius as needed
    padding: '7px',
    fontSize:"12px"            // Adds space inside the border
  }}  />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRemove(file.name)}
                    className="process-crossmark"
                  >
                  <FontAwesomeIcon icon={faXmark} /> 
                  </button>
                )}
              </div>
            ))}
          </div>

          {message && <p className="process-message">{message}</p>}
        </form>
      </div>

      <div style={{ display: "flex", gap: "40px", justifyContent: "space-between", flexWrap: "wrap", marginTop: "40px", padding: "30px" }}>
        <div style={{ flex: 1, textAlign: "center", fontSize: "15px" }}>
          {renderTable(customerDocs, "Customer Uploaded Documents")}
        </div>
        <div style={{ flex: 1, textAlign: "center", fontSize: "15px" }}>
          {renderTable(processDocs, "Process Uploaded Documents")}
        </div>
      </div>
    </div>
  );
};

export default ClientUpload;
