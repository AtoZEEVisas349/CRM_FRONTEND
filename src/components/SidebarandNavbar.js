import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUsers,
  faUserPlus,
  faFile,
  faReceipt,
  faGear,
  faList,
  faCircleXmark,
  faClock,
  faBars,
  faCircleQuestion,
  faBell,
  faCircleUser,
  faRobot,
  faRightFromBracket, // Import logout icon
} from "@fortawesome/free-solid-svg-icons";

const SidebarandNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("executiveName");
  
    navigate("/login");
  
    setTimeout(() => {
      window.location.reload(); // ✅ Prevent going back after logout
    }, 100);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".sidebar_container");
      const menuToggle = document.querySelector(".menu_toggle");
      if (
        sidebar &&
        menuToggle &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <section className="sidebar_navbar">
      <section className={`sidebar_container ${isActive ? "active" : ""}`}>
        <div className="sidebar_heading">
          <h1>AtoZeeVisas</h1>
        </div>
        <div>
          <h3 className="sidebar_crm">CRM</h3>
        </div>
        <nav className="navbar_container">
          <ul>
            <li>
              <Link to="/executive" className="sidebar_nav">
                <span className="sidebar_icon">
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="#"
                className="sidebar_nav"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sidebar_icon">
                  <FontAwesomeIcon icon={faUserPlus} />
                </span>
                Leads
                <span
                  className="dropdown_icon"
                  style={{ marginLeft: "50%", fontSize: "12px" }}
                >
                  ▼
                </span>
              </Link>
              <div className="submenu_container">
                {isOpen && (
                  <ul className="submenu_nav">
                    <li>
                      <Link to="/freshlead" className="sidebar_nav">
                        <span className="sidebar_icon">
                          <FontAwesomeIcon icon={faUsers} />
                        </span>
                        Fresh Leads
                      </Link>
                    </li>
                    <li>
                      <Link to="/follow-up" className="submenu_item">
                        <span className="submenu_icon">
                          <FontAwesomeIcon icon={faList} />
                        </span>
                        Follow ups
                      </Link>
                    </li>
                    <li>
                      <Link to="/customer" className="submenu_item">
                        <span className="submenu_icon">
                          <FontAwesomeIcon icon={faClock} />
                        </span>
                        Convert
                      </Link>
                    </li>
                    <li>
                      <Link to="/close-leads" className="submenu_item">
                        <span className="submenu_icon">
                          <FontAwesomeIcon icon={faCircleXmark} />
                        </span>
                        Close
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <Link to="#" className="sidebar_nav">
                <span className="sidebar_icon">
                  <FontAwesomeIcon icon={faFile} />
                </span>
                Task Management
              </Link>
            </li>
            <li>
              <Link to="#" className="sidebar_nav">
                <span className="sidebar_icon">
                  <FontAwesomeIcon icon={faReceipt} />
                </span>
                Invoice
              </Link>
            </li>
            <li>
              <Link to="#" className="sidebar_nav">
                <span className="sidebar_icon">
                  <FontAwesomeIcon icon={faGear} />
                </span>
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        {/* ✅ Logout Button at Bottom */}
        <div className="logout_container">
          <button className="logout_btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="logout_icon" />
            Logout
          </button>
        </div>
      </section>

      <section className="navbar">
        <div className="menu_search">
          <button
            className="menu_toggle"
            onClick={toggleSidebar}
            aria-expanded={isActive}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="search_bar">
            <input type="text" className="search_input" placeholder="Search" />
          </div>
        </div>
        <div className="navbar_icons">
          <FontAwesomeIcon className="navbar_icon" icon={faCircleQuestion} />
          <FontAwesomeIcon className="navbar_icon" icon={faBell} />
          <FontAwesomeIcon className="navbar_icon" icon={faCircleUser} />
          <FontAwesomeIcon
            className="navbar_icon bot_icon"
            icon={faRobot}
            onClick={() => window.open("/chatbot", "_blank")}
            style={{ cursor: "pointer" }}
          />
        </div>
      </section>
    </section>
  );
};

export default SidebarandNavbar;
