import React from "react";

const FreshLeads = () => {
  const leads = [
    {
      name: "Ashley Lopez",
      job: "Fashion Designer",
      phone: "(212) 535-8263",
      email: "jacobjackson1988@yahoo.com",
    },
    {
      name: "Andrea Sanchez",
      job: "Economics Professor",
      phone: "(845) 732-4788",
      email: "jking@hotmail.com",
    },
    {
      name: "Brian Scott",
      job: "Lawyer",
      phone: "(719) 810-7869",
      email: "ehall@hotmail.com",
    },
    {
      name: "Jaime Jimenez",
      job: "Housekeeper",
      phone: "(619) 656-7396",
      email: "bmartinez@yahoo.com",
    },
    {
      name: "Anthony Davis",
      job: "Clinical Psychologist",
      phone: "(312) 522-6378",
      email: "john_scott@hotmail.com",
    },
    {
      name: "Brian Scott",
      job: "Financial Planner",
      phone: "(973) 836-0348",
      email: "elizsmith@yahoo.com",
    },
    {
      name: "Jennifer Edwards",
      job: "Chemist",
      phone: "(760) 756-7568",
      email: "jennifer_edwards@yahoo.com",
    },
    {
      name: "Matthew Martinez",
      job: "Public Health Inspector",
      phone: "(814) 914-7154",
      email: "matthew.martinez@gmail.com",
    },
    {
      name: "Ryan Miller",
      job: "Developer",
      phone: "(914) 664-1830",
      email: "ryanmiller.dev@gmail.com",
    },
    {
      name: "Brian Thomas",
      job: "Police Officer",
      phone: "(215) 519-7223",
      email: "brianthomas@yahoo.com",
    },
    {
      name: "Joseph White",
      job: "Engineer",
      phone: "(610) 569-3239",
      email: "josephwhite@hotmail.com",
    },
    {
      name: "Anthony Adams",
      job: "Security Guard",
      phone: "(858) 921-1022",
      email: "anthony.adams@gmail.com",
    },
    {
      name: "William Davis",
      job: "Construction Worker",
      phone: "(313) 514-3949",
      email: "williamdavis@yahoo.com",
    },
    {
      name: "Lauren Thompson",
      job: "Historian",
      phone: "(956) 563-9126",
      email: "lauren.thompson@gmail.com",
    },
    {
      name: "Ryan Young",
      job: "Claims Adjuster",
      phone: "(313) 514-3949",
      email: "ryan.young@yahoo.com",
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Fresh Leads</h2>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ background: "#f4f4f4" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Job</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Phone</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={index}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {lead.name}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {lead.job}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {lead.phone}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {lead.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FreshLeads;
