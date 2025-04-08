import React from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const data = [
  { name: "Leads", value: 120 },
  { name: "Proposals", value: 100 },
  { name: "Negotiation", value: 60 },
  { name: "Contracts Sent", value: 20 },
  { name: "Won", value: 20 },
  { name: "Lost", value: 20 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#ff8042", "#a4de6c"];

const OpportunityStage = () => {
  return (
    <div className="chart-container">
      <div className="chart">
        <h2 className="exec-section-title">Opportunity Stage</h2>
        <PieChart width={250} height={200}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            fill="#82ca9d"
            paddingAngle={5}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
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

export default OpportunityStage;
