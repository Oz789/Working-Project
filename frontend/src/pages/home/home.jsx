import React from "react";
import HomeNavBar from "../../components/homeNavBar";

import "./home.css";


const homeBackground = "/images/home.jpg";

const Home = () => {
  return (
<>
    <HomeNavBar/>
    <div 
      className="home-page"
      style={{
        backgroundImage: `url(${homeBackground})`, backgroundSize: "cover", backgroundPosition: "center",
      }}
    >
      <button className="home-button">Book Your Appointment</button>
    </div>
    </>
  );
};

export default Home;


