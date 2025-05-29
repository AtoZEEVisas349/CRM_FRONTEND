import React, { useState, useEffect } from "react";
import "../../styles/report.css";
import logo from "../../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "../../context/ApiContext";
import SidebarToggle from "./SidebarToggle";

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
  "x-company-id": "306ce5f6-27b7-4b9c-a294-6d7d5bba8462",
});

const options = [
  "Lead Visit",
  "Executive Activity",
  "Profit",
  "Meeting",
  "Others",
];

const optionDetails = {
  "Lead Visit": "Visited potential leads and gathered client data.",
  "Executive Activity": "Planned and executed executive-level tasks.",
  Profit: "Calculated daily profit and updated records.",
  Meeting: "Conducted meetings with stakeholders or team members.",
  Others: "Miscellaneous tasks not covered above.",
};

const Eod = () => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const { fetchExecutivesAPI } = useApi();
  const [executives, setExecutives] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const data = await fetchExecutivesAPI();
        setExecutives(data);
        setCards(
          data.map(() => ({
            email: "",
            selected: [],
            date: new Date().toISOString().split("T")[0],
            time: getCurrentTime(),
            dropdownOpen: false,
          }))
        );
      } catch (error) {
        console.error("❌ Error fetching executives:", error);
      }
    };
    fetchExecutives();
  }, []);
  const isSidebarExpanded =
    localStorage.getItem("adminSidebarExpanded") === "true";
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
          : card
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

    let content = `EOD Report for ${username}\nDate: ${date}\nTime: ${time}\n\n`;
    selected.forEach((option) => {
      content += `🔹 ${option}: ${optionDetails[option]}\n`;
    });

    try {
      const res = await fetch("http://localhost:5000/api/report", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, content }),
      });

      if (res.ok) {
        toast.success("Email sent successfully!");
      } else {
        toast.error("Failed to send email.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div
      className={`eod-sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}
    >
      <SidebarToggle />
      <div className="eod-container">
        <ToastContainer />
        <h1 className="eod-main-title">Send Reports</h1>

        <div className="eod-cards-wrapper">
          {executives.map((exec, index) => (
            <form
              key={exec.id}
              className="eod-cards"
              onSubmit={(e) => handleSubmit(e, index)}
            >
              <div className="eod-card-header">
                <input className="eod-checkbox" type="checkbox" />
                <img src={logo} alt="logo" className="eod-logo" />
                <h3 className="eod-user-name">{exec.username}</h3>
              </div>

              <div className="eod-email-container">
                <label htmlFor={`email-${index}`} className="eod-label">
                  Enter your Email:
                </label>
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
                  {cards[index].selected.length > 0
                    ? cards[index].selected.join(", ")
                    : "Choose EOD Report"}
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
                  <label htmlFor={`date-${index}`} className="eod-label">
                    Date:
                  </label>
                  <input
                    type="date"
                    id={`date-${index}`}
                    value={cards[index].date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    className="eod-date-input"
                  />
                </div>
                <div className="eod-time">
                  <label htmlFor={`time-${index}`} className="eod-label">
                    Time:
                  </label>
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
                <button type="submit" className="eod-submit-button">
                  Send Email
                </button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Eod;