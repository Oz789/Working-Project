import React from 'react';

const healthOptions = ['General Pain', 'Blurry Vision', 'Burning Sensation', 'Difficulty Reading', 'Dizziness', 'Double Vision', 'Eye Strain', 'Headaches', 'Itchy Eyes', 'Light Sensitivity', 'Lumps', 'Tunnel Vision', 'Watery Eyes'];
const conditionOptions = ['Cataracts', 'Corneal Abrasion', 'Crossed Eyes', 'Diabetic Retinopathy', 'Dry Eyes', 'Floaters', 'Glaucoma', 'Inflammation', 'Pink Eye', 'Retinal Detachment', 'Uveitis'];
const surgeryOptions = ['Cataract Surgery', 'Corneal Transplant', 'Eyelid Surgery', 'Eye Cancer Surgery', 'Glaucoma Surgery', 'Implants', 'LASIK', 'Orbital Surgery', 'Photorefractive Surgery', 'Retinal Repair', 'Vitrectomy'];

export default function MedicalInfoForm({ nextStep, prevStep, handleChange, values }) {
  const toggleCheckbox = (key, option) => {
    const current = values[key];
    if (current.includes(option)) {
      handleChange({ [key]: current.filter((item) => item !== option) });
    } else {
      handleChange({ [key]: [...current, option] });
    }
  };

  return (
    <div>
      <h2>Medical Information</h2>

      <label>Last Exam Date:</label>
      <input type="date" value={values.lastExamDate} onChange={(e) => handleChange({ lastExamDate: e.target.value })} />

      <div className="checkbox-row">
        <span>Uses Corrective Lenses</span>
        <input type="checkbox" checked={values.usesCorrectiveLenses} onChange={(e) => handleChange({ usesCorrectiveLenses: e.target.checked })} />
      </div>
      <input placeholder="Lenses Prescription" value={values.LensesPrescription} onChange={(e) => handleChange({ LensesPrescription: e.target.value })} disabled={!values.usesCorrectiveLenses} />

      <div className="checkbox-row">
        <span>Uses Contacts</span>
        <input type="checkbox" checked={values.usesContacts} onChange={(e) => handleChange({ usesContacts: e.target.checked })} />
      </div>
      <input placeholder="Contacts Prescription" value={values.ContactsPrescription} onChange={(e) => handleChange({ ContactsPrescription: e.target.value })} disabled={!values.usesContacts} />

      <label>Last Prescription Date:</label>
      <input type="date" value={values.lastPrescriptionDate} onChange={(e) => handleChange({ lastPrescriptionDate: e.target.value })} />

      <h3>Health Concerns</h3>
      {healthOptions.map(option => (
        <div className="checkbox-row" key={option}>
          <span>{option}</span>
          <input type="checkbox" checked={values.healthConcerns.includes(option)} onChange={() => toggleCheckbox('healthConcerns', option)} />
        </div>
      ))}
      <input placeholder="Other Concerns" value={values.otherConcerns} onChange={(e) => handleChange({ otherConcerns: e.target.value })} />

      <h3>Conditions</h3>
      {conditionOptions.map(option => (
        <div className="checkbox-row" key={option}>
          <span>{option}</span>
          <input type="checkbox" checked={values.conditions.includes(option)} onChange={() => toggleCheckbox('conditions', option)} />
        </div>
      ))}
      <input placeholder="Other Conditions" value={values.otherConditions} onChange={(e) => handleChange({ otherConditions: e.target.value })} />

      <h3>Surgeries</h3>
      <div className="checkbox-row">
        <span>Had Surgery</span>
        <input type="checkbox" checked={values.hadSurgery} onChange={(e) => handleChange({ hadSurgery: e.target.checked })} />
      </div>
      {values.hadSurgery && (
        <>
          {surgeryOptions.map(option => (
            <div className="checkbox-row" key={option}>
              <span>{option}</span>
              <input type="checkbox" checked={values.surgeries.includes(option)} onChange={() => toggleCheckbox('surgeries', option)} />
            </div>
          ))}
          <input placeholder="Other Surgeries" value={values.otherSurgeries} onChange={(e) => handleChange({ otherSurgeries: e.target.value })} />
        </>
      )}

      <div className="nav-buttons">
        <button onClick={prevStep}>Back</button>
        <button onClick={nextStep}>Next</button>
      </div>
    </div>
  );
}
