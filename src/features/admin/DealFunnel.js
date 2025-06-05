import React, { useEffect, useState } from "react";
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import io from "socket.io-client";
import { useApi } from "../../context/ApiContext"

const DealFunnel = () => {
  const { fetchDealFunnelData } = useApi(); // Get the API function from context
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("lead_status_update", fetchData);

    // Initial load
    fetchData();

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchData = async () => {
    try {
      const { statusCounts, totalLeads } = await fetchDealFunnelData();
      
      // Define the desired sequence
      const desiredSequence = ['New', 'Assigned', 'Follow-Up', 'Meeting', 'Converted', 'Closed'];
      
      // Build array in the specified order
      const transformed = desiredSequence.map(status => ({
        name: status,
        value: statusCounts[status] || 0
      }));
      
      // Add percent
      const enriched = transformed.map((item) => ({
        ...item,
        percent: totalLeads
          ? ((item.value / totalLeads) * 100).toFixed(1) + "%"
          : "0%",
      }));
      setData(enriched);
    } catch (err) {
      console.error("Error fetching deal funnel data:", err);
    }
  };

  return (
    <>
      <motion.div
        className="chart-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="chart">
          <h2 className="exec-section-title">🚀 Lead Funnel</h2>
          <ResponsiveContainer width={300} height={220}>
            <FunnelChart>
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const { name, value, percent } = payload[0].payload;
                  return (
                    <div
                      style={{
                        background: "#1e293b",
                        padding: "10px",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    >
                      <b>{name}</b>
                      <br />
                      Count: {value}
                      Percentage: {percent}
                    </div>
                  );
                }}
              />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive
                fill="url(#colorFunnel)"
                stroke="white"
                animationDuration={1200}
              />
              <defs>
                <linearGradient id="colorFunnel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6EE7B7" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </FunnelChart>
          </ResponsiveContainer>

          <p style={{ marginTop: "10px" }}>
            <b>Total Leads:</b> {data.reduce((sum, d) => sum + d.value, 0)}
          </p>
        </div>

        <div className="chart-data">
          {data.map((item, idx) => (
            <motion.p
              key={idx}
              className="chart-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="chart-label">
                <span
                  className="dot"
                  style={{ backgroundColor: getStatusColor(item.name) }}
                />
                <b>{item.name}:</b>
              </span>
              <div className="chart-values-container">
                <div className="chart-value">{item.value}</div>
                <div className="chart-percent">{item.percent}</div>
              </div>
            </motion.p>
          ))}
        </div>
      </motion.div>
    </>
  );
};

const getStatusColor = (status) => {
  const colors = {
    New: "#3498db",
    Assigned: "#f39c12",
    "Follow-Up": "#9b59b6",
    Converted: "#2ecc71",
    Closed: "#34495e",
    Rejected: "#e74c3c",
  };
  return colors[status] || "#95a5a6";
};

export default DealFunnel;