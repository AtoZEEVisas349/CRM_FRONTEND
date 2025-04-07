import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";
import ExecutiveActivity from "../features/executive/ExecutiveActivity";
import { recordStopWork } from "../services/executiveService";
import { fetchExecutiveInfo } from "../services/apiService"; // ✅ Import your API function

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
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const SidebarandNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [showUserPopover, setShowUserPopover] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false); // ✅ Add this
  const [userData, setUserData] = useState({
    name: localStorage.getItem("userName") || "User",
    email: localStorage.getItem("userEmail") || "user@example.com",
    role: localStorage.getItem("userRole") || "Role",
  });
  

  const navigate = useNavigate();
  const popoverRef = useRef(null);
  const userIconRef = useRef(null);

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  const handleLogout = async () => {
    const userRole = localStorage.getItem("userRole");

    if (userRole === "Executive") {
      try {
        await recordStopWork();
      } catch (error) {
        console.error("Failed to record work stop:", error);
      }
    }

    localStorage.clear();
    navigate("/login");
    setTimeout(() => window.location.reload(), 100);
  };

  const fetchUserDetails = async () => {
    setIsLoadingUserData(true);
    try {
      const executiveId = localStorage.getItem("userId");
      console.log("Executive ID:", executiveId); // 👈 Check this
  
      if (!executiveId) {
        console.error("No executiveId found in localStorage!");
        setIsLoadingUserData(false);
        return;
      }
  
      const response = await fetchExecutiveInfo(executiveId);
      console.log("Executive data response:", response.data);
  
      if (response?.data?.executive) {
        const { username, email, role } = response.data.executive;
        setUserData({
          name: username || "User",
          email: email || "user@example.com",
          role: role || "Role",
        });
      } else {
        console.error("Executive data is missing:", response.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoadingUserData(false);
    }
  };
  
  

  const handleUserIconClick = () => {
    setShowUserPopover((prev) => !prev);
    fetchUserDetails(); // ✅ Fetch fresh user details when icon is clicked
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setShowUserPopover(false);
      }

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
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <section className="sidebar_navbar">
      {/* Sidebar */}
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
                <span style={{ marginLeft: "auto", fontSize: "12px" }}>▼</span>
              </Link>

              {isOpen && (
                <ul className="submenu_nav">
                  <li>
                    <Link to="/freshlead" className="submenu_item">
                      <span className="submenu_icon">
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
      </section>

      {/* Navbar */}
      <section className="navbar">
        <div className="menu_search">
          <button className="menu_toggle" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>

          <div className="search_bar">
            <input className="search_input" placeholder="Search" />
          </div>
        </div>

        <div className="navbar_icons">
          <FontAwesomeIcon className="navbar_icon" icon={faCircleQuestion} />
          <FontAwesomeIcon className="navbar_icon" icon={faBell} />
          <FontAwesomeIcon
            ref={userIconRef}
            className="navbar_icon"
            icon={faCircleUser}
            onClick={handleUserIconClick} // ✅ Call the function here
            style={{ cursor: "pointer", position: "relative" }}
          />
          <FontAwesomeIcon
            className="navbar_icon bot_icon"
            icon={faRobot}
            onClick={() => window.open("/chatbot", "_blank")}
            style={{ cursor: "pointer" }}
          />
          <FontAwesomeIcon
            className="navbar_icon"
            icon={faClock}
            title="Toggle Activity Tracker"
            onClick={() => setShowTracker((prev) => !prev)}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* User Popover */}
        {showUserPopover && (userData || isLoadingUserData) && (
  <div className="user_popover">
    {isLoadingUserData ? (
      <p>Loading user data...</p>
    ) : (
      <>
        <p><strong>{userData.name}</strong></p>
        <p>{userData.email}</p>
        <p>Role: {userData.role}</p>
        <button className="logout_btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
        </button>
      </>
    )}
  </div>
)}

      </section>

      {/* Activity Tracker */}
      {showTracker && <ExecutiveActivity />}
    </section>
  );
};

export default SidebarandNavbar;
