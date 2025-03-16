import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const NavSearch = () => {
  return (
    <>
      <div className="top_bar">
        <h1 className="c-heading">Close Leads</h1>
        <div className="top_bar_btn">
          <button className="add_btn">+ New</button>
          <div className="c-search_bar">
            <input type="text" className="search_input" placeholder="Search" />
          </div>
          <FontAwesomeIcon icon={faFilter} className="filter_icon" />
        </div>
      </div>
    </>
  );
};

export default NavSearch;
