import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Services from "./pages/services/services"; 
import PatientProfile from "./pages/patientPortal/patientProfile";
import Home from "./pages/home/home"
import Login from "./pages/logIn/login";
import Frames from "./pages/Inventory/frames"
//import CreateAppointment from "./pages/appointments/createAppointment";
import MultiStepForm from "./pages/appointments/MultiStepForm";
import ProfileTemplate from "./components/profileTemplate";
import ContactP from "./pages/contact/contactUs";
import AboutP from "./pages/about/aboutPage";
import EmployeeProfile from "./pages/employeePortal/employeeProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutP/>} />
        <Route path="/contact" element={<ContactP/>} />
        <Route path="/book-appointment" element={<MultiStepForm/>}/>
        <Route path="/services" element={<Services />} />
        <Route path="/userProfile" element={<PatientProfile/>} />
        <Route path="/employeeProfile" element={<EmployeeProfile/>} />
        <Route path="/frames" element={<Frames/>} />
        <Route path="/log-in" element={<Login/>}/>
      </Routes>
    </Router>
  );
}

export default App; 
