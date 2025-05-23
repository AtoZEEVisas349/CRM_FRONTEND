import React, { useState } from "react";
import '../../styles/report.css';
import logo from "../../assets/logo.png"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Dummy data
const users = ["Praveen Kumar", "Ravi Sharma", "Anita Desai"];
const options = ["Lead Visit", "Executive Activity", "Profit", "Meeting", "Others"];

const optionDetails = {
  "Lead Visit": "Visited potential leads and gathered client data.",
  "Executive Activity": "Planned and executed executive-level tasks.",
  "Profit": "Calculated daily profit and updated records.",
  "Meeting": "Conducted meetings with stakeholders or team members.",
  "Others": "Miscellaneous tasks not covered above."
};

const Eod = () => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const [cards, setCards] = useState(
    users.map(() => ({
      email: "",
      selected: [],
      date: new Date().toISOString().split("T")[0],
      time: getCurrentTime(),
      dropdownOpen: false,
    }))
  );

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

    if (!card.email) {
      toast.error("Please enter an email address.");
      return;
    }

    if (card.selected.length === 0) {
      toast.error("Please select at least one report option.");
      return;
    }

    const user = users[cardIndex];
    const { date, time, selected, email } = card;

    let content = `EOD Report for ${user}\nDate: ${date}\nTime: ${time}\n\n`;
    selected.forEach(option => {
      content += `🔹 ${option}: ${optionDetails[option]}\n`;
    });

    try {
      const res = await fetch('http://localhost:3000/resister', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, content })
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
    <div className="eod-container">
      <ToastContainer />
      <h1>Send Reports</h1>

      {users.map((name, index) => (
        <form key={index} className="eod-cards" onSubmit={(e) => handleSubmit(e, index)}>
          <div className="eod-card-header">
            <input className="eod-checkbox" type="checkbox" />
            <img src={logo} alt="logo" />
            <h3>{name}</h3>
          </div>

          <div className="eod-email-container">
            <label htmlFor={`email-${index}`}>Enter your Email:</label>
            <input
              className="email"
              type="email"
              id={`email-${index}`}
              value={cards[index].email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              placeholder="example@domain.com"
              required
            />
          </div>

          <div className="eod-dropdown">
            <button type="button" onClick={() => toggleDropdown(index)}>
              {cards[index].selected.length > 0
                ? cards[index].selected.join(", ")
                : "Choose EOD Report"}
            </button>

            {cards[index].dropdownOpen && (
              <ul className="eod-dropdown-list">
                {options.map((option) => (
                  <li key={option}>
                    <label>
                      <input
                        type="checkbox"
                        checked={cards[index].selected.includes(option)}
                        onChange={() => handleCheckboxChange(index, option)}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="eod-datetime">
            <label htmlFor={`date-${index}`}>Date:</label>
            <input
              type="date"
              id={`date-${index}`}
              value={cards[index].date}
              onChange={(e) => handleDateChange(index, e.target.value)}
            />
          </div>

          <div className="eod-time">
            <label htmlFor={`time-${index}`}>Time:</label>
            <input
              type="time"
              id={`time-${index}`}
              value={cards[index].time}
              onChange={(e) => handleTimeChange(index, e.target.value)}
            />
          </div>

          <div className="eod-submit">
            <button type="submit">Send Email</button>
          </div>
        </form>
      ))}
    </div>
  );
};

export default Eod;
