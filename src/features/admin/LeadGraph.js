import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useApi } from "../../context/ApiContext";

const LeadGraph = ({ selectedExecutiveId, executiveName }) => {
  const { fetchExecutiveDashboardData } = useApi();
  const [chartData, setChartData] = useState({
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
    totalVisits: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedExecutiveId) return;
      
      setLoading(true);
      try {
        // Fetch all executive activities
        const allActivities = await fetchExecutiveDashboardData();
        console.log("All executive activities:", allActivities);
        
        // Find the activity for the selected executive
        const executiveActivity = allActivities.find(
          (activity) => activity.ExecutiveId === selectedExecutiveId
        );
        
        console.log("Selected executive activity:", executiveActivity);
        
        if (executiveActivity && executiveActivity.leadSectionVisits) {
          // For now we're just setting all visits to Monday
          // In a real implementation, you would distribute these across the week
          const weeklyData = [
            executiveActivity.leadSectionVisits || 0, // Monday
            0, // Tuesday
            0, // Wednesday
            0, // Thursday
            0, // Friday
            0, // Saturday
            0, // Sunday
          ];
          
          const totalVisits = weeklyData.reduce((sum, visits) => sum + visits, 0);
          
          setChartData({
            weeklyData,
            totalVisits
          });
        } else {
          // Reset to zero if no data found
          setChartData({
            weeklyData: [0, 0, 0, 0, 0, 0, 0],
            totalVisits: 0
          });
        }
      } catch (err) {
        console.error("Error loading lead visits:", err);
        // Reset on error
        setChartData({
          weeklyData: [0, 0, 0, 0, 0, 0, 0],
          totalVisits: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedExecutiveId]);

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Actual Visits",
        data: chartData.weeklyData,
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        tension: 0.4,
      },
      {
        label: "Target Visits",
        data: [12, 20, 17, 28, 20, 35, 27],
        borderColor: "#facc15",
        backgroundColor: "rgba(250, 204, 21, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} Visits`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#a1a1aa", font: { size: 12 } },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.1)" },
        ticks: { color: "#a1a1aa", font: { size: 12 } },
      },
    },
  };

  return (
    <div className="lead-sec-graph">
      <h2 className="exec-section-title">
        <span>Lead Visit</span>
        <span className="executive-name">{executiveName || "Select an Executive"}</span>
      </h2>

      <div className="mb-4 text-sm text-gray-400">
        Total Visits This Week (from dashboard):{" "}
        <span className="text-white font-medium">
          {loading ? "Loading..." : chartData.totalVisits}
        </span>
      </div>

      <Line data={data} options={options} />
    </div>
  );
};

export default LeadGraph;
