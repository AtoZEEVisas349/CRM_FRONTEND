import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchLeadSectionVisits } from "../../services/apiService"; // ✅ import from service
import "chart.js/auto";

const LeadGraph = ({ selectedExecutiveId, executiveName }) => {
  console.log("LeadGraph - selectedExecutiveId:", selectedExecutiveId);
  console.log("LeadGraph - executiveName:", executiveName);

  const [visitData, setVisitData] = useState([]);

  useEffect(() => {
    const fetchVisitData = async () => {
      if (!selectedExecutiveId) return;

      try {
        const data = await fetchLeadSectionVisits(selectedExecutiveId);
        setVisitData(data.leadSectionVisits || []);
      } catch (err) {
        console.error("Error fetching lead section visits:", err);
      }
    };

    fetchVisitData();
  }, [selectedExecutiveId]);

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Actual Visits",
        data: visitData.length === 7 ? visitData : [0, 0, 0, 0, 0, 0, 0],
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
          label: (tooltipItem) => {
            let label = tooltipItem.dataset.label || "";
            if (label) {
              label += ": ";
            }
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
      <Line data={data} options={options} />
    </div>
  );
};

export default LeadGraph;
