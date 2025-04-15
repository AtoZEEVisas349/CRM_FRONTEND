import React from "react";
import { asserts } from "./asserts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCellsLarge, faBars } from "@fortawesome/free-solid-svg-icons";
import NavSearch from "./NavSearch"; 

const Leads = () => {
  return (
    <div className="close-leads-page">
      <NavSearch /> {/* ✅ Render the top bar here */}

      <div className="leads_page_wrapper">
        

        <h2 className="Total_leads">Total leads: 25</h2>

        <div className="country_container">
          {asserts.map((countryData, index) => (
            <div key={index} className="country_cards">
              <div className="country_name">
                <h3>{countryData.country}</h3>
                <h3>{countryData.leads}</h3>
              </div>
              <ul>
                {countryData.members.map((member, idx) => (
                  <li key={idx} className="c-card">
                    <p>{member.title}</p>
                    <p>{member.paragraph}</p>
                    <p>Est. revenue: {member.amount}</p>
                    <p>
                      {member.Next_Meeting &&
                        `Next Meeting : ${member.Next_Meeting}`}
                    </p>
                    <p>{member.customer}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leads;
