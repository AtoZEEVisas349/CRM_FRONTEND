import React, { useEffect } from "react";
import { useApi } from "../../context/ApiContext";
import useCopyNotification from "../../hooks/useCopyNotification";

const Leads = () => {
  const { closeLeads, fetchAllCloseLeadsAPI, closeLeadsLoading,
    fetchNotifications,
    createCopyNotification,
   } = useApi();
  
   useCopyNotification(createCopyNotification, fetchNotifications);
  useEffect(() => {
    fetchAllCloseLeadsAPI();
  }, []);

  const leadsArray = closeLeads?.data || [];

  return (
    <div className="close-leads-page">
      <h1 className="c-heading">CloseLeads</h1>
      <div className="leads_page_wrapper">
        <h2 className="Total_leads">Total close leads: {leadsArray.length}</h2>
        {closeLeadsLoading ? (
          <p>Loading close leads...</p>
        ) : leadsArray.length > 0 ? (
          <div className="country_container">
            {leadsArray.map((lead, index) => (
              <div key={index} className="country_cards">
                <div className="country_name">
                  <h3>{lead.name || "Unnamed Lead"}</h3>
                  <p>Phone: {lead.phone}</p>
                  <p>Email: {lead.email || "No Email"}</p>
                  <p>Created At: {new Date(lead.createdAt).toLocaleDateString()}</p>
                  {lead.freshLead && (
                    <div className="fresh_lead_details">
                      <h4>Fresh Lead Details:</h4>
                      <p>Name: {lead.freshLead.name}</p>
                      <p>Phone: {lead.freshLead.phone}</p>
                      <p>Email: {lead.freshLead.email || "No Email"}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No close leads found.</p>
        )}
      </div>
    </div>
  );
};

export default Leads;
