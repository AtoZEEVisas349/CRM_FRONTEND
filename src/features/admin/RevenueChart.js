import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useApi } from "../../context/ApiContext"; 

const RevenueChart = () => {
  const { revenueChartData, revenueChartLoading, fetchRevenueChartDataAPI } = useApi();

  // Fetch data on component mount (already handled in ApiContext, but can be triggered here if needed)
  useEffect(() => {
    fetchRevenueChartDataAPI();
  }, []);

  // If loading, show a loading message
  if (revenueChartLoading) {
    return <div>Loading revenue chart data...</div>;
  }

  // If no data, show a message
  if (!revenueChartData || revenueChartData.length === 0) {
    return <div>No revenue data available.</div>;
  }

  // Format the data to match the chart's expectations (if needed)
  const formattedData = revenueChartData.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
    revenue: entry.revenue,
    lead: entry.lead,
  }));

  return (
    <div className="chart-wrapper">
      <h2 className="chart-title">Revenue vs Leads</h2>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="30%" 
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
           <Tooltip
            formatter={(value, name) => (name === "revenue" ? `$${value}` : value)}
          />
            <Legend
              align="right"
              verticalAlign="top"
              wrapperStyle={{ marginTop: "-40px" }}
            />
            <Bar
              dataKey="revenue"
              fill="#4a90e2"
              name="Revenue"
              yAxisId="left"
              barSize={30}
            />
            <Bar
              dataKey="lead"
              fill="#c4c4c4"
              name="Leads"
              yAxisId="right"
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;