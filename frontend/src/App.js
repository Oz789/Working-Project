import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Services from "./pages/services/services"; 
import PatientProfile from "./pages/patientPortal/patientProfile";
import Home from "./pages/home/home"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" />
        <Route path="/contact" />
        <Route path="/book-appointment" />
        <Route path="/services" element={<Services />} />
        <Route path="/userProfile" element={<PatientProfile/>} />
      </Routes>
    </Router>
  );
}

export default App; 
