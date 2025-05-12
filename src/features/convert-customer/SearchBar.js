import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return <input type="text" className="search-bar" placeholder="Search Customers..." value={searchTerm} onChange={handleSearch} />;
};

export default SearchBar;
