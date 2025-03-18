import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserNavbar from "./Components/userNavBar";
import Login from "./pages/logIn/login";
//import CreateAppointment from "./pages/appointments/createAppointment";
import MultiStepForm from "./pages/appointments/MultiStepForm";

function App() {
  return (


    <Router>
      <UserNavbar />
      <Routes>
        <Route path="/about" element={<h1>About Us Page</h1>} />
        <Route path="/contact" element={<h1>Contact Us Page</h1>} />
        <Route path="/book-appointment" element={<MultiStepForm />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    

  );
}

export default App;