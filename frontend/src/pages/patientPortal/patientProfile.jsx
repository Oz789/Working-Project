import React, { useState } from "react";
import ProfileTemplate from "../../components/profileTemplate";

const PatientProfile = () => {
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    dob: "",
    sex: "",
    address: "",
    phone: "",
    lastExamDate: "",
    usesCorrectiveLenses: "",
    usesContacts: "",
    lensesPrescription: "",
    contactsPrescription: "",
    lastPrescriptionDate: "",
    healthConcerns: "",
    otherConcerns: "",
    conditions: "",
    otherConditions: "",
    hadSurgery: "",
    surgeries: "",
    otherSurgeries: "",
    allergies: "",
    additionalDetails: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  return (
    <ProfileTemplate
      /* Left Sidebar (Patient Information) */
      sidebarContent={
        <div>
          <h2 className="section-title">Patient Information</h2>
          <label>Name:</label>
          <input type="text" name="name" value={patientData.name} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>Email:</label>
          <input type="email" name="email" value={patientData.email} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>DOB:</label>
          <input type="date" name="dob" value={patientData.dob} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>Sex:</label>
          <select name="sex" value={patientData.sex} onChange={handleChange} className="input-field" disabled={!isEditing}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Address:</label>
          <input type="text" name="address" value={patientData.address} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>Phone:</label>
          <input type="tel" name="phone" value={patientData.phone} onChange={handleChange} className="input-field" readOnly={!isEditing} />
        </div>
      }

      /* Center Section (Medical Form Data) */
      mainContent={
        <div>
          <h2 className="section-title">Medical Form Data</h2>

          <label>Last Exam Date:</label>
          <input type="date" name="lastExamDate" value={patientData.lastExamDate} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>Uses Corrective Lenses:</label>
          <select name="usesCorrectiveLenses" value={patientData.usesCorrectiveLenses} onChange={handleChange} className="input-field" disabled={!isEditing}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <label>Uses Contacts:</label>
          <select name="usesContacts" value={patientData.usesContacts} onChange={handleChange} className="input-field" disabled={!isEditing}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <label>Lenses Prescription:</label>
          <input type="text" name="lensesPrescription" value={patientData.lensesPrescription} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>Contacts Prescription:</label>
          <input type="text" name="contactsPrescription" value={patientData.contactsPrescription} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>Last Prescription Date:</label>
          <input type="date" name="lastPrescriptionDate" value={patientData.lastPrescriptionDate} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <h3 className="subsection-title">Health Concerns</h3>
          <textarea name="healthConcerns" value={patientData.healthConcerns} onChange={handleChange} className="textarea-field" readOnly={!isEditing}></textarea>

          <h3 className="subsection-title">Other Concerns</h3>
          <textarea name="otherConcerns" value={patientData.otherConcerns} onChange={handleChange} className="textarea-field" readOnly={!isEditing}></textarea>

          <h3 className="subsection-title">Conditions</h3>
          <textarea name="conditions" value={patientData.conditions} onChange={handleChange} className="textarea-field" readOnly={!isEditing}></textarea>

          <h3 className="subsection-title">Additional Details</h3>
          <textarea name="additionalDetails" value={patientData.additionalDetails} onChange={handleChange} className="textarea-field" readOnly={!isEditing}></textarea>

          {/* Buttons */}
          <div className="button-group">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="save-btn">Save</button>
                <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
            )}
          </div>
        </div>
      }

      /* Right Section (Extra Content, Placeholder for Now) */
      extraContent={
        <p style={{ color: "#aaa", fontStyle: "italic" }}>Content coming soon...</p>
      }
    />
  );
};

export default PatientProfile;









