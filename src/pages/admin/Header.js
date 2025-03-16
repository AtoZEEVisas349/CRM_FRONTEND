import React, { useState, useRef } from "react";
import { 
  FaPhone, FaEnvelope, FaBell, FaUser, 
  FaFilter, FaCalendarAlt, FaChevronDown 
} from "react-icons/fa";
import DatePicker from "react-datepicker";  
import "react-datepicker/dist/react-datepicker.css"; 

const Header = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [dateRange, setDateRange] = useState([new Date(currentYear, 0, 1), today]);
  const [startDate, endDate] = dateRange;
  const datepickerRef = useRef(null);

  return (
    <header className="header">
      <h1>Dashboard</h1>

      <div className="header-right">
        {/* Date Picker with Dropdown Icon and Filter Icon */}
        <div className="date-filter">
          <div className="date-picker">
            <FaCalendarAlt className="icon enhanced-icon" />
            <DatePicker
              ref={datepickerRef} 
              selectsRange={true} 
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              dateFormat="MMM dd, yyyy"
              placeholderText="Select Date Range"
              showMonthDropdown={true}
              showYearDropdown={true}
              dropdownMode="select"
              minDate={new Date(2000, 0, 1)}
              maxDate={new Date(currentYear, 11, 31)}
              onFocus={(e) => e.target.blur()}
            />
            <FaChevronDown 
              className="icon enhanced-icon dropdown-icon" 
              onClick={() => datepickerRef.current.setOpen(true)} 
            />
          </div>
          <FaFilter className="icon enhanced-icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
