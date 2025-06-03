import React, { useContext, useEffect } from "react";
import { useApi } from "../../context/ApiContext";
import useCopyNotification from "../../hooks/useCopyNotification";
import { SearchContext } from "../../context/SearchContext";
const Leads = ({searchQuery}) => {
  const { closeLeads, fetchAllCloseLeadsAPI, closeLeadsLoading,
    fetchNotifications,
    createCopyNotification,
   } = useApi();
  const {activePage}= useContext(SearchContext);
   useCopyNotification(createCopyNotification, fetchNotifications);
  useEffect(() => {
    fetchAllCloseLeadsAPI();
  }, []);

  const leadsArray = closeLeads?.data || [];
 // ✅ apply search only if this page is active
 const filteredLeads =
 activePage === "close-leads"
   ? leadsArray.filter((lead) =>
       [lead.name, lead.phone, lead.email]
         .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
     )
   : leadsArray;
  return (
    <div className="close-leads-page">
      <h2 className="c-heading">CloseLeads</h2>
      <div className="leads_page_wrapper">
        <h4 className="Total_leads">Total close leads: {filteredLeads.length}</h4>
        {closeLeadsLoading ? (
          <p>Loading close leads...</p>
        ) : filteredLeads.length > 0 ? (
          <div className="scrollable-leads-container">
          <div className="country_container">
            {filteredLeads.map((lead, index) => (
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
</div>
        ) : (
          <p>No close leads found.</p>
        )}
      </div>
    </div>
  );
};

export default Leads;
