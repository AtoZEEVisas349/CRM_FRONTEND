// import React from "react";
// import { Line } from "react-chartjs-2";
// import "chart.js/auto";

// const LeadSectionGraph = () => {
//   const data = {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     datasets: [
//       {
//         label: "Actual Visits",
//         data: [15, 25, 18, 32, 22, 40, 30], // Sample data for 1 week
//         borderColor: "#8b5cf6", // Purple line
//         backgroundColor: "rgba(139, 92, 246, 0.2)", // Faded fill
//         tension: 0.4, // Smooth curve
//       },
//       {
//         label: "Target Visits",
//         data: [12, 20, 17, 28, 20, 35, 27], // Target comparison
//         borderColor: "#facc15", // Yellow line
//         backgroundColor: "rgba(250, 204, 21, 0.2)",
//         tension: 0.4,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         callbacks: {
//           label: (tooltipItem) => {
//             let label = tooltipItem.dataset.label || "";
//             if (label) {
//               label += ": ";
//             }
//             label += `$${tooltipItem.raw} Visits`;
//             return label;
//           },
//         },
//       },
//     },
//     scales: {
//       x: {
//         grid: { display: false },
//         ticks: { color: "#a1a1aa", font: { size: 12 } },
//       },
//       y: {
//         grid: { color: "rgba(255, 255, 255, 0.1)" },
//         ticks: { color: "#a1a1aa", font: { size: 12 } },
//       },
//     },
//   };

//   return (
//     <div className="lead-section-graph">
//       <h2 className="e-section-title">Leads Section Visit</h2>
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default LeadSectionGraph;
