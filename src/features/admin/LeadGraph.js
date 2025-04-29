import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useApi } from "../../context/ApiContext";

const LeadGraph = ({ selectedExecutiveId, executiveName }) => {
  const { fetchExecutivesDashboardData } = useApi(); // Assuming you have this API call to fetch the data
  const [leadSectionVisits, setLeadSectionVisits] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedExecutiveId) {
        setLoading(true);
        try {
          // Fetch the executive data from the API
          const result = await fetchExecutivesDashboardData(selectedExecutiveId); 
          console.log("Fetched Data for Executive:", result);

          // Extract the leadSectionVisits value for the selected executive
          const executiveData = result?.executives?.find(
            (exec) => exec.ExecutiveId === selectedExecutiveId
          );

          if (executiveData) {
            setLeadSectionVisits(executiveData.leadSectionVisits || 0);
          }
        } catch (error) {
          console.error("Error fetching executive data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedExecutiveId]);

  const weeklyData = [leadSectionVisits, 0, 0, 0, 0, 0, 0]; // For simplicity, we're assuming visits for this week
  const totalVisits = weeklyData.reduce((sum, val) => sum + val, 0); // Total visits for display

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Actual Visits",
        data: weeklyData,
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        tension: 0.4,
      },
      {
        label: "Target Visits",
        data: [12, 20, 17, 28, 20, 35, 27], // Example target data
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
          label: (tooltipItem) => {
            let label = tooltipItem.dataset.label || "";
            if (label) label += ": ";
            label += `${tooltipItem.raw} Visits`;
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#a1a1aa", font: { size: 12 } },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#a1a1aa", font: { size: 12 } },
      },
    },
  };

  return (
    <div className="lead-sec-graph">
      <h2 className="exec-section-title">
        <span>Lead Visit</span>
        <span className="executive-name">{executiveName || "Loading..."}</span>
      </h2>

      <div className="mb-4 text-sm text-gray-400">
        Total Visits This Week (from dashboard):{" "}
        <span className="text-white font-medium">
          {loading ? "Loading..." : totalVisits}
        </span>
      </div>

      <Line data={data} options={options} />
    </div>
  );
};

export default LeadGraph;
