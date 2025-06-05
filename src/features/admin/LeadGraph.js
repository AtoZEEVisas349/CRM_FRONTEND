import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useApi } from "../../context/ApiContext";

const LeadGraph = ({ selectedExecutiveId, executiveName }) => {
  const { fetchExecutiveDashboardData } = useApi();
  const [chartData, setChartData] = useState({
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
    totalVisits: 0,
  });
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("line");

  const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";

  const getTodayIndex = () => {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allActivities = await fetchExecutiveDashboardData();
        const todayIndex = getTodayIndex();
        const updatedWeeklyData = [0, 0, 0, 0, 0, 0, 0];
        let totalVisits = 0;

        if (selectedExecutiveId) {
          const executiveActivity = allActivities.find(
            (activity) => activity.ExecutiveId === selectedExecutiveId
          );

          if (executiveActivity?.leadSectionVisits > 0) {
            updatedWeeklyData[todayIndex] = executiveActivity.leadSectionVisits;
          }
          totalVisits = updatedWeeklyData.reduce((sum, visits) => sum + visits, 0);
        } else {
          allActivities.forEach((activity) => {
            if (activity?.leadSectionVisits > 0) {
              updatedWeeklyData[todayIndex] += activity.leadSectionVisits;
            }
          });
          totalVisits = updatedWeeklyData.reduce((sum, visits) => sum + visits, 0);
        }

        setChartData({
          weeklyData: updatedWeeklyData.map((v) => Math.max(0, v)),
          totalVisits,
        });
      } catch (err) {
        console.error("Error loading lead visits:", err);
        setChartData({
          weeklyData: [0, 0, 0, 0, 0, 0, 0],
          totalVisits: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedExecutiveId]);

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxLead = Math.max(...chartData.weeklyData);
  const dynamicMax = Math.max(70, Math.ceil((maxLead + 10) / 10) * 10);

  const baseDataset = {
    label: "Lead Visits",
    data: chartData.weeklyData,
    borderColor: "#8b5cf6",
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    tension: 0.4,
    pointRadius: 3,
    pointHoverRadius: 5,
    borderWidth: 2,
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} Visits`,
        },
      },
      datalabels: {
        color: isDarkMode ? "#ffffff" : "#000000",
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
          color: isDarkMode ? "#ffffff" : "#333",
          font: { size: 16, weight: "500" },
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: dynamicMax,
        ticks: {
          stepSize: 10,
          color: isDarkMode ? "#ffffff" : "#333",
          font: { size: 10, weight: "500" },
        },
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim() || "#e5e7eb",
        },
      },
    },
  };

  return (
    <div className="lead-graph-container">
      <div className="lead-graph-header">
        <h2 className="lead-graph-title">
          Lead Visit:{" "}
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
          onClick={() => setChartType((prev) => (prev === "line" ? "bar" : "line"))}
          className="lead-graph-button"
        >
          Switch to {chartType === "line" ? "Bar" : "Line"} Graph
        </button>
      </div>

      <div className="lead-graph-summary">
        Total Visits This Week (from dashboard):{" "}
        <span>{loading ? "Loading..." : chartData.totalVisits}</span>
      </div>

      <div style={{ height: "77%" }}>
        {chartType === "line" ? (
          <Line
            data={{ labels, datasets: [baseDataset] }}
            options={commonOptions}
            plugins={[ChartDataLabels]}
          />
        ) : (
          <Bar
            data={{
              labels,
              datasets: [
                {
                  ...baseDataset,
                  backgroundColor: "#8b5cf6",
                  borderRadius: 4,
                  borderWidth: 0,
                },
              ],
            }}
            options={commonOptions}
            plugins={[ChartDataLabels]}
          />
        )}
      </div>
    </div>
  );
};

export default LeadGraph;
