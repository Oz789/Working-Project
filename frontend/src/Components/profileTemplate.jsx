import React, { useState } from "react";
import "./profileTemplate.css";
import UserNavbar from "../components/NavBar";

const ProfileTemplate = ({ sidebarContent, mainContent, extraContent }) => {
  return (
    <>
      <UserNavbar />
      <div className="profile-container">
        <div className="profile-wrapper">

          <div className="profile-sidebar">
            {sidebarContent ? sidebarContent : <p style={{ color: "#aaa", fontStyle: "italic" }}>Add</p>}
          </div>

          <div className="profile-content">
            {mainContent ? mainContent : <p style={{ color: "#aaa", fontStyle: "italic" }}>Shit</p>}
          </div>

          <div className="profile-extra">
            {extraContent ? extraContent : <p style={{ color: "#aaa", fontStyle: "italic" }}>Here</p>}
          </div>

        </div>
      </div>
    </>
  );
};

export default ProfileTemplate;
