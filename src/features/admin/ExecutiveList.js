import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useApi } from "../../context/ApiContext"; // ✅ import the hook

const ExecutiveList = ({ onSelectExecutive }) => {
  const [executives, setExecutives] = useState([]);
  const { fetchExecutivesAPI } = useApi(); // ✅ get API function from context

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const data = await fetchExecutivesAPI(); // ✅ use context function
        setExecutives(data);
      } catch (error) {
        console.error("Error fetching executives:", error);
      }
    };

    fetchExecutives();
  }, [fetchExecutivesAPI]); // ✅ dependency array

  return (
    <div className="executive-container">
      <h2 className="executive-title">Executives</h2>
      {executives.length === 0 ? (
        <p className="executive-empty">No executives found</p>
      ) : (
        <ul className="executive-list">
          {executives.map((exec) => (
            <li
              key={exec.id}
              className="executive-item"
              onClick={() => onSelectExecutive(exec)} // Pass full executive object
              style={{ cursor: "pointer" }}
            >
              <div className="executive-info">
                <FaUserCircle className="executive-icon" />
                <div className="executive-details">
                  <p className="executive-name">{exec.username}</p>
                </div>
              </div>
              <p className="executive-id">ID: {exec.id}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExecutiveList;
