import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useApi } from "../../context/ApiContext";

const CallData = ({ selectedExecutiveId, executiveName }) => {
  const { fetchExecutiveCallDurations } = useApi();

  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("bar");

  const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";

  useEffect(() => {
    const loadCallDurations = async () => {
      if (!selectedExecutiveId) return;
      setLoading(true);
      try {
        const res = await fetchExecutiveCallDurations(selectedExecutiveId);
        setWeeklyData(res.weeklyData || [0, 0, 0, 0, 0, 0, 0]);
      } catch (err) {
        console.error("CallData error:", err);
        setWeeklyData([0, 0, 0, 0, 0, 0, 0]);
      } finally {
        setLoading(false);
      }
    };

    loadCallDurations();
  }, [selectedExecutiveId, fetchExecutiveCallDurations]);

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const totalMinutes = weeklyData.reduce((sum, val) => sum + val, 0);
  const maxY = Math.max(...weeklyData);
  const dynamicMax = Math.max(30, Math.ceil((maxY + 5) / 5) * 5);

  const baseDataset = {
    label: "Call Duration (mins)",
    data: weeklyData,
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.3)",
    tension: 0.4,
    pointRadius: 3,
    pointHoverRadius: 5,
    borderWidth: 2,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} mins`,
        },
      },
      datalabels: {
        color: isDarkMode ? "#fff" : "#000",
        font: { size: 10, weight: "bold" },
        anchor: "end",
        align: "top",
        formatter: (value) => value,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDarkMode ? "#fff" : "#333",
          font: { size: 16, weight: "500" },
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: dynamicMax,
        ticks: {
          stepSize: 5,
          color: isDarkMode ? "#fff" : "#333",
          font: { size: 12, weight: "500" },
        },
        grid: {
          color:
            getComputedStyle(document.documentElement).getPropertyValue(
              "--chart-grid"
            ) || "#e5e7eb",
        },
      },
    },
  };

  return (
    <div className="lead-graph-container">
      <div className="lead-graph-header">
        <h2 className="lead-graph-title">
          Call Time:{" "}
          <span
            className={
              loading
                ? "lead-graph-loading"
                : executiveName
                ? "lead-graph-executive-name"
                : "lead-graph-placeholder-name"
            }
          >
            {executiveName || "Loading..."}
          </span>
        </h2>

        <button
          onClick={() =>
            setChartType((prev) => (prev === "line" ? "bar" : "line"))
          }
          className="lead-graph-button"
        >
          Switch to {chartType === "line" ? "Bar" : "Line"} Graph
        </button>
      </div>

      <div className="lead-graph-summary">
        Total Call Time This Week:{" "}
        <strong>{loading ? "..." : totalMinutes} mins</strong>
      </div>

      <div style={{ height: "77%" }}>
        {chartType === "line" ? (
          <Line
            data={{ labels, datasets: [baseDataset] }}
            options={chartOptions}
            plugins={[ChartDataLabels]}
          />
        ) : (
          <Bar
            data={{
              labels,
              datasets: [
                {
                  ...baseDataset,
                  backgroundColor: "#10b981",
                  borderRadius: 4,
                  borderWidth: 0,
                },
              ],
            }}
            options={chartOptions}
            plugins={[ChartDataLabels]}
          />
        )}
      </div>
    </div>
  );
};

export default CallData;