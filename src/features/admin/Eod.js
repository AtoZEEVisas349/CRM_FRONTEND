// Eod.jsx
import React, { useState, useEffect, useRef } from "react";
import "../../styles/report.css";
import logo from "../../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "../../context/ApiContext";
import SidebarToggle from "./SidebarToggle";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useLoading } from "../../context/LoadingContext";
import AdminSpinner from "../spinner/AdminSpinner";
const options = ["Lead Visit", "Executive Activity", "Profit", "Meeting", "Others"];

const Eod = () => {
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5);
  const getCurrentDate = () => new Date().toISOString().split("T")[0];
  const { showLoader, hideLoader, isLoading, variant } = useLoading();
  const {
    fetchExecutivesAPI,
    fetchExecutiveDashboardData,
    adminMeeting,
    sendEodReport,
  } = useApi();

  const [executives, setExecutives] = useState([]);
  const [cards, setCards] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [meetingData, setMeetingData] = useState({});
  const [openCalendarIndex, setOpenCalendarIndex] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setOpenCalendarIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        showLoader("Loading EOD data...", "admin");
        const execData = await fetchExecutivesAPI();
        const dashboardArray = await fetchExecutiveDashboardData();
        const meetings = await adminMeeting();

        const dashboard = dashboardArray.reduce((acc, item) => {
          acc[item.ExecutiveId || item.executiveId] = item;
          return acc;
        }, {});

        const meetingMap = meetings.reduce((acc, meeting) => {
          const id = meeting.executiveId || meeting.ExecutiveId;
          if (!id) return acc;
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {});

        setExecutives(execData);
        setDashboardData(dashboard);
        setMeetingData(meetingMap);

        setCards(
          execData.map(() => ({
            email: "",
            selected: [],
            startDate: getCurrentDate(),
            endDate: getCurrentDate(),
            time: getCurrentTime(),
            dropdownOpen: false,
          }))
        );
      } catch (error) {
        console.error("❌ Error fetching EOD data:", error);
      } finally {
        hideLoader();
      }
    };
    fetchAllData();
  }, []);


  const convertTime = (seconds) => {
    if (seconds > 0) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return "0h 0m 0s";
  };

  const getOptionDetails = (execId) => {
    const data = dashboardData[execId] || {};
    const dashboardMeetings = data.meetingsConducted || data.meetingCount || 0;
    const fetchedMeetings = meetingData[execId] || 0;
    return {
      "Lead Visit": `Visited ${data.leadSectionVisits || 0} potential leads today.`,
      "Executive Activity": `Work Time: ${convertTime(data.workTime || 0)}, Break Time: ${convertTime(data.breakTime || 0)}, Call Time: ${convertTime(data.dailyCallTime || 0)}.`,
      Profit: `Calculated daily profit: $${data.profit || 0}.`,
      Meeting: `Total meetings conducted/scheduled: ${dashboardMeetings + fetchedMeetings}`,
      Others: data.others || "Miscellaneous tasks not covered above.",
    };
  };

  const handleCheckboxChange = (cardIndex, option) => {
    setCards((prevCards) =>
      prevCards.map((card, index) =>
        index === cardIndex
          ? {
              ...card,
              selected: card.selected.includes(option)
                ? card.selected.filter((item) => item !== option)
                : [...card.selected, option],
            }
          : card
      )
    );
  };

  const handleDateRangeChange = (cardIndex, ranges) => {
    const { startDate, endDate } = ranges.selection;
    setCards((prevCards) =>
      prevCards.map((card, index) =>
        index === cardIndex
          ? {
              ...card,
              startDate: startDate.toISOString().split("T")[0],
              endDate: endDate.toISOString().split("T")[0],
            }
          : card
      )
    );
  };

  const handleTimeChange = (cardIndex, value) => {
    setCards((prevCards) =>
      prevCards.map((card, index) =>
        index === cardIndex ? { ...card, time: value } : card
      )
    );
  };

  const handleEmailChange = (cardIndex, value) => {
    setCards((prevCards) =>
      prevCards.map((card, index) =>
        index === cardIndex ? { ...card, email: value } : card
      )
    );
  };

  const toggleDropdown = (cardIndex) => {
    setCards((prevCards) =>
      prevCards.map((card, index) =>
        index === cardIndex
          ? { ...card, dropdownOpen: !card.dropdownOpen }
          : card
      )
    );
  };

  const handleSubmit = async (e, cardIndex) => {
    e.preventDefault();
    const card = cards[cardIndex];
    const exec = executives[cardIndex];

    if (!card.email) return toast.error("Please enter an email address.");
    if (card.selected.length === 0) return toast.error("Please select at least one report option.");

    const { time, selected, email, startDate, endDate } = card;
    const execId = exec?.id;
    const execName = exec?.username || "Executive";
    const optionDetail = getOptionDetails(execId);

    let content = `📋 EOD Report for ${execName}\nTime: ${time}\n\n`;
    selected.forEach((option) => {
      content += `🔹 ${option}: ${optionDetail[option] || "N/A"}\n`;
    });

    const payload = {
      email,
      content: content.trim(),
      startDate,
      endDate,
      time,
    };

    try {
      await sendEodReport(payload);
      toast.success("Email scheduled successfully!");
    } catch (err) {
      console.error("❌ Failed to send EOD report:", err);
      toast.error("Failed to schedule email.");
    }
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("adminSidebarExpanded") === "false"
  );

  return (
    <div className={`eod-layout-wrapper ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
      <aside className="eod-sidebar">
        <SidebarToggle />
      </aside>
      <div className="eod-container">
              {isLoading && variant === "admin" && (
          <AdminSpinner text="Loading Eod Report..." />
        )}
        <ToastContainer />
        <h1 className="eod-main-title">Send Reports</h1>
        <div className="eod-cards-wrapper">
          {executives.map((exec, index) => (
            <form key={exec.id} className="eod-cards" onSubmit={(e) => handleSubmit(e, index)}>
              <div className="eod-card-header">
                <input className="eod-checkbox" type="checkbox" />
                <img src={logo} alt="logo" className="eod-logo" />
                <h3 className="eod-user-name">{exec.username}</h3>
              </div>
              <div className="eod-email-container">
                <label htmlFor={`email-${index}`} className="eod-label">Enter your Email:</label>
                <input
                  className="eod-email-input"
                  type="email"
                  id={`email-${index}`}
                  value={cards[index]?.email || ""}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder="example@domain.com"
                  required
                />
              </div>
              <div className="eod-dropdown">
                <label className="eod-label">Select Report Type:</label>
                <button
                  type="button"
                  onClick={() => toggleDropdown(index)}
                  className="eod-dropdown-button"
                >
                  {cards[index].selected.length > 0 ? cards[index].selected.join(", ") : "Choose EOD Report"}
                </button>
                {cards[index].dropdownOpen && (
                  <ul className="eod-dropdown-list">
                    {options.map((option) => (
                      <li key={option} className="eod-dropdown-item">
                        <label className="eod-dropdown-label">
                          <input
                            type="checkbox"
                            checked={cards[index].selected.includes(option)}
                            onChange={() => handleCheckboxChange(index, option)}
                            className="eod-dropdown-checkbox"
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="eod-datetime-wrapper">
                <div className="eod-datetime">
                  <label className="eod-label">Date Range:</label>
                  <button
                    type="button"
                    className="eod-date-input"
                    onClick={() =>
                      setOpenCalendarIndex(index === openCalendarIndex ? null : index)
                    }
                  >
                    {cards[index].startDate} to {cards[index].endDate}
                  </button>
                  {openCalendarIndex === index && (
                    <div ref={calendarRef} style={{ position: "absolute", zIndex: 10 }}>
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => handleDateRangeChange(index, item)}
                        moveRangeOnFirstSelection={false}
                        ranges={[{
                          startDate: new Date(cards[index].startDate),
                          endDate: new Date(cards[index].endDate),
                          key: "selection",
                        }]}
                      />
                    </div>
                  )}
                </div>

                <div className="eod-time">
                  <label htmlFor={`time-${index}`} className="eod-label">Time:</label>
                  <input
                    type="time"
                    id={`time-${index}`}
                    value={cards[index].time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="eod-time-input"
                  />
                </div>
              </div>

              <div className="eod-submit">
                <button type="submit" className="eod-submit-button">Schedule Email</button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Eod;


