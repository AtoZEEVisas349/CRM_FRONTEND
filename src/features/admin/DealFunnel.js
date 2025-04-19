// RealTimeDealFunnel.js
import React, { useEffect, useState } from "react";
import {
  FunnelChart,
  Funnel,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios"; // install axios if not present

const DealFunnel = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/deal-funnel");
      const rawData = response.data;
      console.log("🔥 Deal Funnel Response:", response.data);
      const total = rawData[0]?.value || 1;
      const enrichedData = rawData.map((item) => ({
        ...item,
        percent: ((item.value / total) * 100).toFixed(1) + "%",
      }));

      setData(enrichedData);
    } catch (error) {
      console.error("Error fetching deal funnel data:", error);
    }
  };

  return (
    <motion.div
      className="chart-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="chart">
        <h2 className="exec-section-title">🚀 Deal Funnel</h2>
        <ResponsiveContainer width={300} height={220}>
          <FunnelChart>
            <Tooltip
              content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const { name, value } = payload[0].payload;
                return (
                  <div style={{
                    background: "#1e293b",
                    padding: "10px",
                    borderRadius: "6px",
                    color: "#fff"
                  }}>
                    <b>{name}</b><br />
                    Count: {value}<br />
                    
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
            >
             <LabelList
    position="right"
    fill="white"
    stroke="none"
    dataKey="value"
    formatter={(value) => `${value}`} // ✅ Correct here
  />
            </Funnel>
            <defs>
              <linearGradient id="colorFunnel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </FunnelChart>
        </ResponsiveContainer>
        <p style={{ marginTop: "10px" }}>
          <b>Total:</b> {data.reduce((acc, d) => acc + d.value, 0)}
        </p>
      </div>

      <div
        className="chart-data"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {data.map((item, index) => (
          <motion.p
            key={index}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <span className="chart-label">
              <span className="dot"></span>
              <b>{item.name}:</b>
            </span>
            <span>{item.value} ({item.percent})</span>
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
};

export default DealFunnel;
