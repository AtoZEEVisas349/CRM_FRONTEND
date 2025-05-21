import React, { useState, useRef } from "react";
import {
  FaFilter,
  FaCalendarAlt,
  FaChevronDown,
  FaBars
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminNavbar from "../../layouts/AdminNavbar";

const Header = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [dateRange, setDateRange] = useState([new Date(currentYear, 0, 1), today]);
  const [startDate, endDate] = dateRange;
  const datepickerRef = useRef(null);

  const toggleSidebar = () => {
    const isExpanded = document.body.classList.contains("sidebar-expanded");
    document.body.classList.toggle("sidebar-expanded", !isExpanded);
    document.body.classList.toggle("sidebar-collapsed", isExpanded);

    localStorage.setItem("adminSidebarExpanded", (!isExpanded).toString());
    window.dispatchEvent(new Event("sidebarToggle"));
  };

  return (
    <>
      <AdminNavbar />
      <header className="header">
        <div className="header-left">
          <FaBars className="sidebar-toggle-btn" onClick={toggleSidebar} />
          <h1>Dashboard</h1>
        </div>

        <div className="header-right">
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
                dropdownMode="select"
                minDate={new Date(2000, 0, 1)}
                maxDate={today}
                openToDate={today} // ✅ show current month initially
                onFocus={(e) => e.target.blur()}
                showPopperArrow={false}
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => {
                  const currentMonth = today.getMonth();
                  const currentYear = today.getFullYear();

                  const isFutureMonth =
                    date.getMonth() >= currentMonth && date.getFullYear() >= currentYear;

                  return (
                    <div className="custom-header">
                      <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                      >
                        {"<"}
                      </button>
                      <span>
                        {date.toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled || isFutureMonth}
                      >
                        {">"}
                      </button>
                    </div>
                  );
                }}
              />
              <FaChevronDown
                className="icon enhanced-icon dropdown-icon"
                onClick={() => datepickerRef.current.setOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
