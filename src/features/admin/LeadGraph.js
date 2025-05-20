import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useApi } from "../../context/ApiContext";

const LeadGraph = () => {
  const { fetchExecutiveDashboardData, fetchExecutivesAPI } = useApi();
  const [executives, setExecutives] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [chartData, setChartData] = useState({
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
    totalVisits: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadExecutives = async () => {
      const data = await fetchExecutivesAPI();
      setExecutives(data);
      setSelectedExecutive(data[0]); // default selection
    };
    loadExecutives();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedExecutive) return;
      setLoading(true);
      try {
        const allActivities = await fetchExecutiveDashboardData();
        const executiveActivity = allActivities.find(
          (activity) => activity.ExecutiveId === selectedExecutive.id
        );

        if (executiveActivity && executiveActivity.leadSectionVisits) {
          const weeklyData = [
            executiveActivity.leadSectionVisits || 0, 0, 0, 0, 0, 0, 0
          ];
          const totalVisits = weeklyData.reduce((sum, visits) => sum + visits, 0);
          setChartData({ weeklyData, totalVisits });
        } else {
          setChartData({ weeklyData: [0, 0, 0, 0, 0, 0, 0], totalVisits: 0 });
        }
      } catch (err) {
        console.error("Error loading lead visits:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedExecutive]);

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
      x: { grid: { display: false }, ticks: { color: "#a1a1aa" } },
      y: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#a1a1aa" } },
    },
  };

  return (
    <div className="lead-sec-graph">
      <h2 className="exec-section-title">Lead Visit</h2>
      <select
        value={selectedExecutive?.id || ""}
        onChange={(e) =>
          setSelectedExecutive(executives.find((ex) => ex.id === e.target.value))
        }
        style={{ marginBottom: "1rem" }}
      >
        {executives.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.username}
          </option>
        ))}
      </select>

      <div className="mb-4 text-sm text-gray-400">
        Total Visits This Week:{" "}
        <span className="text-white font-medium">
          {loading ? "Loading..." : chartData.totalVisits}
        </span>
      </div>

      <Line data={data} options={options} />
    </div>
  );
};

export default LeadGraph;
