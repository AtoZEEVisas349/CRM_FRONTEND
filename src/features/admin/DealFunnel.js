import React from "react";
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Leads", value: 120 },
  { name: "Sales Calls", value: 100 },
  { name: "Follow-up", value: 60 },
  { name: "Conversion", value: 20 },
  { name: "Sale", value: 15 },
];

const DealFunnel = () => {
  return (
    <div className="chart-container">
      <div className="chart">
        <h2>Deal Funnel</h2>
        <ResponsiveContainer width={250} height={180}>
          <FunnelChart>
            <Tooltip />
            <Funnel
              dataKey="value"
              data={data}
              isAnimationActive
              fill="rgba(136, 132, 216, 0.8)"
              stroke="white"
            />
          </FunnelChart>
        </ResponsiveContainer>
        <p>Total <b>150</b></p>
      </div>
      <div className="chart-data">
        {data.map((item, index) => (
          <p key={index}>
            <span className="chart-label">
              <span className="dot"></span><b>{item.name}:</b>
            </span>
            <span>{item.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default DealFunnel;
