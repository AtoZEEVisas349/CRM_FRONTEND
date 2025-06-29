import React, { useState, useEffect } from "react";
import "../../styles/report.css";
import logo from "../../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "../../context/ApiContext";
import SidebarToggle from "./SidebarToggle";
import { useLoading } from "../../context/LoadingContext";
import AdminSpinner from "../spinner/AdminSpinner";

const options = ["Lead Visit", "Executive Activity", "Profit", "Meeting", "Others"];

const Eod = () => {
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

  const {
    fetchExecutivesAPI,
    fetchExecutiveDashboardData,
    adminMeeting,
    sendEodReport
  } = useApi();
  const { showLoader, hideLoader, isLoading, variant } = useLoading();
  const [executives, setExecutives] = useState([]);
  const [cards, setCards] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [meetingData, setMeetingData] = useState({});

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
            date: new Date().toISOString().split("T")[0],
            time: getCurrentTime(),
            dropdownOpen: false,
          }))
        );
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
      finally {
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

  const handleDateChange = (cardIndex, value) => {
    setCards((prevCards) =>
      prevCards.map((card, index) =>
        index === cardIndex ? { ...card, date: value } : card
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
          : { ...card, dropdownOpen: false } // Close other dropdowns
      )
    );
  };

  const handleSubmit = async (e, cardIndex) => {
    e.preventDefault();
    const card = cards[cardIndex];
    const exec = executives[cardIndex];
  
    if (!card.email) {
      toast.error("Please enter an email address.");
      return;
    }
  
    if (card.selected.length === 0) {
      toast.error("Please select at least one report option.");
      return;
    }
  
    const { date, time, selected, email } = card;
    const username = exec?.username || "Unknown Executive";
    const execId = exec?.id;
    const optionDetail = getOptionDetails(execId);
  
    let content = `EOD Report for ${username}\nDate: ${date}\nTime: ${time}\n\n`;
    selected.forEach((option) => {
      content += `🔹 ${option}: ${optionDetail[option] || "N/A"}\n`;
    });
  
    try {
      await sendEodReport({ email, content });
      toast.success("Email sent successfully!");
    } catch (err) {
      console.error("❌ Failed to send EOD report:", err);
      toast.error("Failed to send email.");
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

        <div className="eod-table-wrapper">
          <table className="eod-table">
            <thead>
              <tr>
                <th>Executive</th>
                <th>Email</th>
                <th>Report Type</th>
                <th>Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {executives.map((exec, index) => (
                <tr key={exec.id}>
                  {/* Executive Info Column */}
                  <td>
                    <div className="eod-executive-info">
                      <img src={logo} alt="logo" className="eod-logo" />
                      <div className="eod-executive-details">
                        <h4>{exec.username}</h4>
                        <span>ID: {exec.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Email Column */}
                  <td>
                    <input
                      className="eod-email-input"
                      type="email"
                      value={cards[index]?.email || ""}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder="example@domain.com"
                      required
                    />
                  </td>

                  {/* Report Type Column */}
                  <td>
                    <div className="eod-dropdown">
                      <button
                        type="button"
                        onClick={() => toggleDropdown(index)}
                        className="eod-dropdown-button"
                      >
                        {cards[index]?.selected.length > 0
                          ? cards[index].selected.join(", ")
                          : "Choose EOD Report"}
                      </button>

                      {cards[index]?.dropdownOpen && (
                        <ul className="eod-dropdown-list">
                          {options.map((option) => (
                            <li key={option} className="eod-dropdown-item">
                              <label className="eod-dropdown-label">
                                <input
                                  type="checkbox"
                                  checked={cards[index]?.selected.includes(option) || false}
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
                  </td>

                  {/* Date Time Column */}
                  <td>
                    <div className="eod-datetime-wrapper">
                      <input
                        type="date"
                        value={cards[index]?.date || ""}
                        onChange={(e) => handleDateChange(index, e.target.value)}
                        className="eod-date-input"
                      />
                      <input
                        type="time"
                        value={cards[index]?.time || ""}
                        onChange={(e) => handleTimeChange(index, e.target.value)}
                        className="eod-time-input"
                      />
                    </div>
                  </td>

                  {/* Action Column */}
                  <td>
                    <button 
                      type="button"
                      onClick={(e) => handleSubmit(e, index)}
                      className="eod-submit-button"
                    >
                      Send Email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Eod;



