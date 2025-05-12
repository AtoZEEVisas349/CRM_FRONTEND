import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faTableCellsLarge,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

const NavSearch = () => {
  return (
    <div className="top_bar">
      <h1 className="c-heading">CloseLeads</h1>
      <div className="top_controls">
        <div className="top_bar_btn">
          <button className="add_btn">+ New</button>
          <input type="text" className="search_input" placeholder="Search" />
          </div>

        <div className="view_controls">
          <label htmlFor="group-by" className="dropdown_label">Group by</label>
          <select className="filter_dropdown" id="group-by">
            <option>Stage</option>
            <option>Status</option>
          </select>
          <div className="icon_toggle">
            <FontAwesomeIcon className="table_icon" icon={faTableCellsLarge} />
            <FontAwesomeIcon className="table_icon" icon={faBars} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavSearch;
