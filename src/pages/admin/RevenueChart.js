import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const currentDate = new Date();
const labels = Array.from({ length: 8 }, (_, i) => {
  let date = new Date();
  date.setDate(currentDate.getDate() - (7 - i));
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
});

// Hardcoded data (matching the image)
const data = [
  { date: labels[0], revenue: 40000, lead: 45 },
  { date: labels[1], revenue: 45000, lead: 50 },
  { date: labels[2], revenue: 30000, lead: 30 },
  { date: labels[3], revenue: 15000, lead: 20 },
  { date: labels[4], revenue: 5000, lead: 5 },
  { date: labels[5], revenue: 48000, lead: 35 },
  { date: labels[6], revenue: 32000, lead: 25 },
  { date: labels[7], revenue: 42000, lead: 45 },
];

const RevenueChart = () => {
  return (
    <div className="chart-wrapper">
      <h2 className="chart-title">Revenue vs Leads</h2>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="30%" // Adjusts spacing between bars
          >
            <XAxis dataKey="date" />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => value}
            />
            <Tooltip formatter={(value, name) => (name === "revenue" ? `$${value}` : value)} />
            <Legend align="right" verticalAlign="top" wrapperStyle={{ marginTop: "-40px" }} />
            <Bar dataKey="revenue" fill="#4a90e2" name="Revenue" yAxisId="left" barSize={30} />
            <Bar dataKey="lead" fill="#c4c4c4" name="Leads" yAxisId="right" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
