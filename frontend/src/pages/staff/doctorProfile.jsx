import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./doctorProfile.css";
import UserNavbar from "../../components/navBar";

function DoctorProfile() {
    const { doctorID } = useParams();
    const [doctorData, setDoctorData] = useState(null);
  
    useEffect(() => {
      fetch(`http://localhost:5001/api/doctors/${doctorID}`)
        .then((res) => res.json())
        .then((data) => setDoctorData(data))
        .catch((err) => console.error("Failed to load doctor profile:", err));
    }, [doctorID]);
  
    if (!doctorData) return <div>Loading...</div>;
  
    return (
        <>
        <UserNavbar/>
      <div>
        <h1>Welcome Dr. {doctorData.fullName}</h1>
        <p>Email: {doctorData.email}</p>
        <p>License #: {doctorData.licenseNumber}</p>
        <p>Specialization: {doctorData.specialization}</p>
      </div>
      </>
    );
  }
  
  export default DoctorProfile;