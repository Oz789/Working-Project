import { CartProvider } from "./context/CartContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Services from "./pages/services/services";
import PatientProfile from "./pages/patientPortal/patientProfile";
import Home from "./pages/home/home";
import Login from "./pages/logIn/login";
import Frames from "./pages/Inventory/frames";
import MultiStepForm from "./pages/appointments/MultiStepForm";
import AdminProfile from "./pages/admin/adminProfile";
import AdminDashboard from "./pages/admin/adminDashboard";
import DoctorProfilePage from "./pages/doctor/doctorProfilePage";
import ContactP from "./pages/contact/contactUs";
import AboutP from "./pages/about/aboutPage";
import EmployeeProfilePage from "./pages/employeePortal/receptionist/receptionistProfile";
import EmployeeForm from "./pages/employeePortal/employeeForm";
import ScheduleAppointment from "./pages/appointments/ScheduleAppointment";
import AdminFrames from "./pages/admin/frames/adminFrames";
import AdminContacts from "./pages/admin/contacts/adminContactsPage";
import AdminServices from "./pages/admin/services/adminServicesPage";
import AdminStaff from "./pages/admin/employee/manageStaff";
import UserFrames from "./pages/Inventory/userFrames";
import AdminProfilePage from "./pages/admin/adminProfile2";
import InventoryReport from "./pages/admin/reports/inventoryReport";
import PaymentForm from "./pages/billing/paymentForm";
import CartPage from "./pages/CartPage";  // Import CartPage component
import Checkout from "./pages/billing/paymentForm";
import PatientFormViewer from "./pages/doctor/doctorsPatientView";
import RegisterPatient from "./pages/logIn/register";
import NurseProfilePage from "./pages/employeePortal/nurse/nurseProfile";
import NurseExamPage from "./pages/employeePortal/nurse/nurseExamPage";
import DoctorExamForm from './pages/doctor/doctorExamForm';
import PatientReport from "./pages/admin/reports/patientReport";
import PatientDemographicsReport from "./pages/admin/reports/patientDemographicsReport";
import PatientPrescriptionReport from "./pages/admin/reports/patientPrescriptionReport";
import AdminReports from "./pages/admin/reports/adminReportsPage";
//import ReferralForm from "./pages/doctor/referral";
import CheckoutPage from './components/checkoutPage';
import UserCheckout from "./pages/checkout/userCheckout";
import ReceptionistCheckout from "./pages/checkout/receptionistCheckout";
import ReferralBookingForm from './pages/referral/referralApptForm';
import SchManager from "./components/employee/schManager";
import NursePrepForm from "./pages/employeePortal/nurse/nursePrepForm";
import AdminDoctorSchedule from './pages/admin/employee/scheduler';
import StockMonitor from "./pages/admin/reports/stockMonitor";
import PatientInbox from "./pages/patientPortal/patientInbox";
import FullFormViewer from "./pages/patientPortal/patientFormsViewer";





function App() {
  return (
    <CartProvider> 
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutP />} />
          <Route path="/contact" element={<ContactP />} />
          <Route path="/book-appointment" element={<MultiStepForm />} />
          <Route path="/services" element={<Services />} />
          <Route path="/userProfile/:patientID" element={<PatientProfile />} />
          <Route path="/employeeProfile/:employeeID" element={<EmployeeProfilePage />} />
          <Route path="/frames" element={<UserFrames />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminProfile />} />
          <Route path="/onboard-employee" element={<EmployeeForm />} />
          <Route path="/doctorProfile/:doctorID" element={<DoctorProfilePage />} />
          <Route path="/admin/admin-frames" element={<AdminFrames />} />
          <Route path="/admin/admin-eyeContacts" element={<AdminContacts />} />
          <Route path="/admin/admin-services" element={<AdminServices />} />
          <Route path="/admin/manageStaff" element={<AdminStaff />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/adminProfile/:employeeID" element={<AdminProfilePage />} />
          <Route path="/inventory-report" element={<InventoryReport />} />
          <Route path="/patient-report" element={<PatientReport />} />
          <Route path="/patientDemographicsReport" element={<PatientDemographicsReport />} />
          <Route path="/patientPrescriptionReport" element={<PatientPrescriptionReport />} />
          <Route path="/payment" element={<PaymentForm />} />
          <Route path="/cart" element={<CartPage />} />
          
          <Route path="/patientViewer/:id" element={<PatientFormViewer />} />
          <Route path="/register" element={<RegisterPatient/>}/>
          <Route path="/appt" element={<ScheduleAppointment/>}/>
          <Route path="/nurseProfile/:id" element={<NurseProfilePage />} />
          <Route path="/nurseExamPage/:id" element={<NurseExamPage />} />
          <Route path="/doctorexamform/:appointmentID/:patientID" element={<DoctorExamForm />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/userCheckout" element={<UserCheckout />} />
          <Route path="/apptCheckout" element={<ReceptionistCheckout/>} />
          <Route path="/referral-booking" element={<ReferralBookingForm />} />
          <Route path="/appt2" element={<SchManager />} />
          <Route path="/nurseForm/:appointmentNumber" element={<NursePrepForm />} />
          <Route path="/admin/doctor-schedule" element={<AdminDoctorSchedule />} />
          <Route path="/stock-manager" element={<StockMonitor />} />
          <Route path="/userInbox/:patientID" element={<PatientInbox />} />
          <Route path="/allForms/:patientID" element={<FullFormViewer />} />
          
          

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
