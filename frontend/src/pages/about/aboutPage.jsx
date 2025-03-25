import React from "react";
import HomeNavBar from "../../components/homeNavBar";

const AboutP = () => {
  return (
    <>
    <HomeNavBar/>

    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800">Hello, React!</h1>
        <p className="text-gray-600">This is a basic React component.</p>
      </div>
    </div>
    </>
  );
};

export default AboutP; 