import React, { useEffect, useState } from "react";
import NursePrepForm from "../employeePortal/nurse/nursePrepForm";
import DoctorExamForm from "../doctor/doctorExamForm";
import PatientFormViewer from "../patientPortal/patientFormViewer";
import ReferralBookingForm from "../referral/referralApptForm";

const PatientFormViewerFull = ({ patientIDProp }) => {
  const [formsData, setFormsData] = useState(null);
  const [page, setPage] = useState(0);

  const patientID = patientIDProp || localStorage.getItem("patientID");

  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/allPatientForms/${patientID}`);
        if (!res.ok) throw new Error("Failed to fetch form data.");
        const data = await res.json();
        setFormsData(data);
      } catch (err) {
        console.error("Form fetch error:", err);
      }
    };

    if (patientID) fetchAllForms();
  }, [patientID]);

  const formsList = [
    { title: "Medical History", component: <PatientFormViewer patientID={patientID} /> },
    { title: "Nurse Prep Form", component: <NursePrepForm formData={formsData?.nurseForm || {}} /> },
    { title: "Doctor Eye Exam", component: <DoctorExamForm formData={formsData?.doctorExamForm || {}} /> },
    { title: "Referral Form", component: <ReferralBookingForm formData={formsData?.referralForm || {}} /> },
  ];

  if (!formsData) return <p style={{ padding: "2rem" }}>Loading forms...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>{formsList[page].title}</h2>
      <div className="form-pdf-wrapper">
        {formsList[page].component}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Previous</button>
        <button disabled={page === formsList.length - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
      </div>
    </div>
  );
};

export default PatientFormViewerFull;
