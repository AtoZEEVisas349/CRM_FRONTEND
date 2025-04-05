// import React, { useState, useEffect } from 'react';
// import MapDisplay from './MapDisplay';

// function ReportCards() {
//   const [data, setData] = useState({
//     freshLeads: 0,
//     followUps: 0,
//     convertedClients: 0,
//   });

//   function fetchRealTimeData() {
//     const apiResponse = {
//       freshLeads: Math.floor(Math.random() * 2000) + 500,
//       followUps: Math.floor(Math.random() * 3000) + 1000,
//       convertedClients: Math.floor(Math.random() * 500) + 20,
//     };

//     setData(apiResponse);
//   }

//   useEffect(() => {
//     fetchRealTimeData(); // Initial fetch
//     const interval = setInterval(fetchRealTimeData, 5000); // Update every 5 sec

//     return () => clearInterval(interval); // Cleanup interval on unmount
//   }, []);

//   return (
//     <>
    
//     <h1 className="e-heading"> Reports </h1>
//     <div className="report-cards">
//       <div className="card">
//         <div className="card-icon">👤</div>
//         <div className="card-trend up">↑ 55%</div>
//         <div className="card-title">Fresh Leads</div>
//         <div className="card-value">{data.freshLeads}</div>
//       </div>

//       <div className="card">
//         <div className="card-icon">📈</div>
//         <div className="card-trend up">↑ 25%</div>
//         <div className="card-title">All Follow Ups</div>
//         <div className="card-value">{data.followUps}</div>
//       </div>

//       <div className="card">
//         <div className="card-icon">😊</div>
//         <div className="card-trend down">↓ 5%</div>
//         <div className="card-title">Converted Clients</div>
//         <div className="card-value">{data.convertedClients}</div>
//       </div>

//       <MapDisplay />
//     </div>

//     </>
//       );
// }

// export default ReportCards;
