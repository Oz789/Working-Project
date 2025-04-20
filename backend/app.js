require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require("./db"); 
const createContacts = require('./routes/patient/createContacts');
const employeeRoutes = require('./routes/employee/newEmployee'); 
const loginRoutes = require('./login/login');
const registerPatient = require("./login/register");
const createDoctorRoute = require('./routes/doctor/createDoctor');
const getDoctorRoute = require('./routes/doctor/getDoctor');
const patientRoutes = require('./routes/patientRoutes');
const messageRoutes = require('./routes/message/getMessage');
const insuranceRoutes = require('./routes/insuranceRoutes');
//const formRoutes = require('./routes/patients/createContacts');
const createFramesRoute = require('./routes/admin/createFrames');
const getFramesRoute = require('./routes/admin/getFrames');
const deleteFrameRoute = require('./routes/admin/deleteFrames');
const updateFrameRoute = require('./routes/admin/updateFrames');
const createContactRoute = require('./routes/admin/createContacts');
const getContactsRoute = require('./routes/admin/getContacts');
const deleteContactsRoute = require('./routes/admin/deleteContacts');
const createServiceRoute = require('./routes/admin/createService');
const getServicesRoute = require('./routes/admin/getService');
const deleteServiceRoute = require('./routes/admin/deleteService');
const deleteEmployeeRoute = require('./routes/employee/deleteEmployee');
const getEmployeeRoute = require('./routes/employee/getEmployee');
const updateContactsRoute = require('./routes/admin/updateContacts');
const updateServicesRoute = require('./routes/admin/updateServices');
const getInventoryRoute = require('./routes/reports/getInventory');
const appointmentRoutes = require('./routes/getAppointments');

const schRoute = require('./routes/employee/schManager');
const checkoutRoutes = require('./routes/checkoutRoutes');
const authenticateToken = require('./middleware/auth');
const updateEmployee = require('./routes/employee/updateEmployee');
const getDoctorAppointments = require('./routes/getAppointments');
const getAllAppointments = require('./routes/receptionist/getAllAppointments');
const locationRoutes = require('./routes/doctor/locations'); 
const scheduleRoutes = require('./routes/doctor/schedule');
const scheduledappointmentRoutes = require('./routes/appointmentRoutes');
const getClinicAppointments = require('./routes/receptionist/getClinicAppointments');
const updateStatus = require("./routes/receptionist/updateStatus");
const getNursePatient = require("./routes/nurse/nurseExam");
const updateNurseForm = require('./routes/nurse/updateNurseForm');
const createExamReport = require('./routes/doctor/updateEyeExamForm');
const createReferralRoute = require('./routes/doctor/referral');
const endAppointmentRoute = require('./routes/doctor/endAppointment');
const getNotifications = require('./routes/notifications/getNotification');
const markReadNotification = require('./routes/notifications/readNotification');
const checkinRoute = require('./routes/receptionist/checkedin'); 
const patientReportRoutes = require('./routes/patientReportRoutes');
const billingRoutes = require('./routes/billing');
const contactRoutes = require('./routes/contact');
const referrPatientRoute = require('./routes/receptionist/referral')
const referralAppointments = require('./routes/receptionist/referralAppts');

const updatePatientInfo = require('./routes/receptionist/getPatientInfo');

const checkoutReceptionistRoute = require('./routes/cart/checkoutRoute');
const checkoutReceptionistItemsRoute = require('./routes/cart/checkoutServices');
const checkoutUser= require('./routes/cart/userCheckout');
const referralAppointmentRoutes = require('./routes/receptionist/referralAppts');
const finalizeCheckoutRoute = require('./routes/cart/receptionistCheckout');

const updateFormRoutes = require('./routes/nurse/updateNurseForm');
const getDoctorActiveAppointments = require('./routes/doctor/getDoctorActiveAppointments');
const getStockCountRoutes = require('./routes/admin/getStock');
const getInsuranceByPatient = require('./routes/cart/appointmentInsurance');
const doctorScheduleRoute = require('./routes/admin/scheduler');
const getPatientFromAppointment = require('./routes/nurse/getPatientFromappt');
const nursepatientInfoRoutes = require('./routes/nurse/nursePatientInfo');
const mostPurchasedRoute = require("./routes/reports/mostPurchased");
const getStockAlertsRoute = require('./routes/receptionist/getNoti');
const restockInventoryRoute = require('./routes/admin/restockInventory');
const gatherEmployee = require('./routes/employee/gatherEmployee')

const sentRoute = require('./routes/message/sendMessage')
const checkUserTypeRoute = require('./routes/message/checkUserType');
const msgPatients = require('./routes/patient/getPatient');


const filterRoutes = require('./routes/message/messageFilter');
const readRoutes = require('./routes/message/responded');
const responseRoute = require('./routes/message/responseFilter');
const sentFilterRoute = require('./routes/message/sentFilter')
const getExamFormRoute = require('./routes/doctor/getEyeExamForm');
const editEmployeeRoute = require('./routes/admin/editEmployee');
const editPatientRoute = require('./routes/admin/adminEditPatients');
const adminGetAllPatients = require('./routes/admin/adminGetPatients');
const deletePatients = require('./routes/admin/deletePatient');
const getDoctorSchedules = require('./routes/admin/getDoctorSchedules');









const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        
        message: "Access granted to protected route ",
        user: req.user
    });
});

app.use("/api/employees", employeeRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/doctor", createDoctorRoute);
app.use("/api", getDoctorRoute);
app.use("/api/patients", patientRoutes);
app.use("/api/messages", messageRoutes);
app.use("/", createContacts);
app.use("/", checkoutRoutes)
app.use('/api/employees', employeeRoutes); 
app.use('/api/login', loginRoutes);
app.use('/api/doctor', createDoctorRoute);
app.use('/api', getDoctorRoute);
app.use('/api/patients', patientRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', editEmployeeRoute);

//app.use('/api/submit-form', formRoutes);
app.use('/api', getDoctorSchedules);
app.use('/api/schedule', schRoute);
app.use('/', createContacts);
app.use('/api', createFramesRoute);
app.use('/api', getFramesRoute);
app.use('/api', deleteFrameRoute);
app.use('/api', updateFrameRoute);
app.use('/api', createContactRoute);
app.use('/api', getContactsRoute);
app.use('/api', updateContactsRoute);
app.use('/api', deleteContactsRoute);
app.use('/api', createServiceRoute);
app.use('/api/get-patient-from-appointment', getPatientFromAppointment);
app.use('/api', referralAppointmentRoutes);
app.use("/api/nursePatient", getNursePatient);
app.use('/api', getServicesRoute);
app.use('/api', deleteServiceRoute);
app.use('/api/employees', deleteEmployeeRoute)
app.use('/api', getEmployeeRoute)
app.use('/api/employees', updateEmployee);
app.use('/api', updateServicesRoute);
app.use('/api', getInventoryRoute);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', getAllAppointments);
app.use('/api/register-patient', registerPatient);
app.use('/api/locations', locationRoutes);
app.use('/api/doctorschedule', doctorScheduleRoute);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/appointments', scheduledappointmentRoutes);
app.use('/api/appointments', updateStatus);
app.use('/api/examReports', createExamReport);
app.use('/api/referrals', createReferralRoute);
app.use('/api/appointments', endAppointmentRoute);
app.use('/api/notifications', getNotifications);
app.use('/api/notifications/mark-read', markReadNotification);
app.use('/api/appointments', checkinRoute);
app.use('/api/referralAppointments', referralAppointments);
app.use('/api/checkout', checkoutReceptionistRoute);
app.use('/api/checkout/items', checkoutReceptionistItemsRoute);
app.use('/api', checkoutUser);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/patientReport', patientReportRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/referrals', referralAppointmentRoutes);
app.use('/api/allPatients', updatePatientInfo);
app.use('/api/finalize-checkout', finalizeCheckoutRoute);
app.use('/api', updateFormRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/appointments/activeByDoctor', getDoctorActiveAppointments);
app.use('/api/appointments', getClinicAppointments);
app.use('/api/checkout/stock', getStockCountRoutes);
app.use('/api/nurseprep', updateNurseForm);
app.use('/api/insurance/patient', getInsuranceByPatient);
app.use('/api/examform', getExamFormRoute);

app.use('/api/doctorschedule', doctorScheduleRoute);
app.use("/api/doctor", getDoctorRoute);
app.use('/api', nursepatientInfoRoutes);
app.use("/api/reports", mostPurchasedRoute);
app.use('/api', restockInventoryRoute);
app.use('/api', getStockAlertsRoute);
app.use('/api/nonadmin', gatherEmployee);

app.use('/api/sendmsg', sentRoute);
app.use('/api/user-type', checkUserTypeRoute);

app.use('/api/pati', msgPatients);

app.use('/api/mess/user', filterRoutes);
app.use('/api/responded', readRoutes);
app.use('/api/mess/unresponded', responseRoute);
app.use('/api', adminGetAllPatients);

app.use('/api/mess/sent', sentFilterRoute);
app.use('/api', editPatientRoute);
app.use('/api', deletePatients);



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



