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

const options = [
  { key: "leadVisits", label: "Lead Visit" },
  { key: "executiveActivity", label: "Executive Activity" },
  { key: "meeting", label: "Meeting" },
];

const getCurrentDate = () => new Date().toISOString().split("T")[0];
const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

const Eod = () => {
  const { fetchExecutivesAPI, sendEodReport } = useApi();
  const calendarRef = useRef(null);

  const [executives, setExecutives] = useState([]);
  const [cards, setCards] = useState([]);
  const [openCalendarIndex, setOpenCalendarIndex] = useState(null);
  const [sidebarCollapsed] = useState(
    localStorage.getItem("adminSidebarExpanded") === "false"
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setOpenCalendarIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const data = await fetchExecutivesAPI(); // [{ id, username }]
        setExecutives(data);

        const initialCards = data.map(() => ({
          email: "",
            
          selected: [],
          startDate: getCurrentDate(),
          endDate: getCurrentDate(),
          time: getCurrentTime(),
          dropdownOpen: false,
        }));
        setCards(initialCards);
      } catch (error) {
        console.error("Error fetching executives:", error);
        toast.error("Failed to load executives.");
      }
    };

    fetchExecutives();
  }, []);

  const handleCheckboxChange = (index, key) => {
    setCards((prev) =>
      prev.map((card, i) =>
        i === index
          ? {
              ...card,
              selected: card.selected.includes(key)
                ? card.selected.filter((item) => item !== key)
                : [...card.selected, key],
            }
          : card
      )
    );
  };

  const handleDateRangeChange = (index, ranges) => {
    const { startDate, endDate } = ranges.selection;
    setCards((prev) =>
      prev.map((card, i) =>
        i === index
          ? {
              ...card,
              startDate: startDate.toISOString().split("T")[0],
              endDate: endDate.toISOString().split("T")[0],
            }
          : card
      )
    );
  };

  const handleTimeChange = (index, value) => {
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, time: value } : card))
    );
  };

  const handleEmailChange = (index, value) => {
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, email: value } : card))
    );
  };

  const toggleDropdown = (index) => {
    setCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, dropdownOpen: !card.dropdownOpen } : card
      )
    );
  };

  const handleSubmit = async (e, index) => {
    e.preventDefault();
    const card = cards[index];
    const exec = executives[index];

    if (!card.email) {
      toast.error("Please enter an email.");
      return;
    }

    if (card.selected.length === 0) {
      toast.error("Select at least one report option.");
      return;
    }

    const payload = {
      executiveId: exec.id,
      executiveName: exec.username,
      email: card.email,
      fields: card.selected,
      startDate: card.startDate,
      endDate: card.endDate,
      time: card.time,
    };

    console.log("✅ Payload being sent:", payload);

    try {
      await sendEodReport(payload);
      toast.success("Report scheduled successfully!");
    } catch (err) {
      console.error("❌ Failed to schedule:", err);
      toast.error("Failed to schedule report.");
    }
  };

  return (
    <div className={`eod-layout-wrapper ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
      <aside className="eod-sidebar">
        <SidebarToggle />
      </aside>
      <div className="eod-container">
        <ToastContainer />
        <h1 className="eod-main-title">Send Reports</h1>
        <div className="eod-cards-wrapper">
          {executives.map((exec, index) => (
            <form key={exec.id} className="eod-cards" onSubmit={(e) => handleSubmit(e, index)}>
              <div className="eod-card-header">
                <input type="checkbox" className="eod-checkbox" />
                <img src={logo} alt="logo" className="eod-logo" />
                <h3 className="eod-user-name">{exec.username}</h3>
              </div>

              <div className="eod-email-container">
                <label className="eod-label">Email:</label>
                <input
                  type="email"
                  className="eod-email-input"
                  value={cards[index]?.email || ""}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  required
                  placeholder="example@example.com"
                />
              </div>

              <div className="eod-dropdown">
                <label className="eod-label">Select Report Type:</label>
                <button
                  type="button"
                  onClick={() => toggleDropdown(index)}
                  className="eod-dropdown-button"
                >
                  {cards[index].selected.length > 0
                    ? cards[index].selected.map((k) => options.find((o) => o.key === k)?.label).join(", ")
                    : "Choose Report"}
                </button>
                {cards[index].dropdownOpen && (
                  <ul className="eod-dropdown-list">
                    {options.map(({ key, label }) => (
                      <li key={key} className="eod-dropdown-item">
                        <label className="eod-dropdown-label">
                          <input
                            type="checkbox"
                            className="eod-dropdown-checkbox"
                            checked={cards[index].selected.includes(key)}
                            onChange={() => handleCheckboxChange(index, key)}
                          />
                          {label}
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
                      setOpenCalendarIndex(openCalendarIndex === index ? null : index)
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
                        ranges={[
                          {
                            startDate: new Date(cards[index].startDate),
                            endDate: new Date(cards[index].endDate),
                            key: "selection",
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>

                <div className="eod-time">
                  <label className="eod-label" htmlFor={`time-${index}`}>Time:</label>
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


