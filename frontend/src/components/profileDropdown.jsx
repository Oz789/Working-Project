import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './dropdown.css';

const getPortalLink = () => {
  const role = localStorage.getItem("userRole");
  const id = localStorage.getItem("userID");
  const doctorID = localStorage.getItem("doctorID");

  if (!role || !id) return "/log-in";

  switch (role.toLowerCase()) {
    case "admin":
      return `/adminProfile/${id}`;
    case "doctor":
      return `/doctorProfile/${doctorID}`;
    case "receptionist":
      return `/employeeProfile/${id}`;
    case "nurse":
      return `/nurseProfile/${id}`;
    case "patient":
      return `/userProfile/${id}`;
    default:
      return "/log-in";
  }
};

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("userID");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/home';
  };

  return (
    <div className="profile-dropdown-wrapper">
      <button className="profile-icon-button" onClick={() => setOpen(!open)}>
        <FaUserCircle />
      </button>

      {open && (
        <div className="profile-menu">
          <Link
            to={getPortalLink()}
            className="profile-link"
          >
            {isLoggedIn ? "View Profile" : "Log In"}
          </Link>

          <hr />

          {isLoggedIn && (
            <button onClick={handleLogout}>Log Out</button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;



