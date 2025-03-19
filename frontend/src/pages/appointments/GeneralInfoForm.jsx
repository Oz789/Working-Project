import React from 'react';

export default function GeneralInfoForm({ nextStep, handleChange, values }) {
  const addEmergencyContact = () => {
    handleChange({ emergencyContacts: [...values.emergencyContacts, { name: '', phone: '' }] });
  };

  return (
    <div>
      <h2>General Information</h2>
      <input placeholder="First Name" value={values.firstName} onChange={(e) => handleChange({ firstName: e.target.value })} />
      <input placeholder="Last Name" value={values.lastName} onChange={(e) => handleChange({ lastName: e.target.value })} />
      <input type="date" value={values.dob} onChange={(e) => handleChange({ dob: e.target.value })} />
      <input placeholder="Email" value={values.email} onChange={(e) => handleChange({ email: e.target.value })} />
      <input placeholder="Phone" value={values.phone} onChange={(e) => handleChange({ phone: e.target.value })} />
      <input placeholder="Address" value={values.address} onChange={(e) => handleChange({ address: e.target.value })} />
      <input placeholder="Insurance Provider" value={values.insurance} onChange={(e) => handleChange({ insurance: e.target.value })} />

      <h3>Emergency Contacts</h3>
      {values.emergencyContacts.map((contact, idx) => (
        <div key={idx} className="emergency-contact">
          <input placeholder="Contact Name" value={contact.name} onChange={(e) => {
            const newContacts = [...values.emergencyContacts];
            newContacts[idx].name = e.target.value;
            handleChange({ emergencyContacts: newContacts });
          }} />
          <input placeholder="Contact Phone" value={contact.phone} onChange={(e) => {
            const newContacts = [...values.emergencyContacts];
            newContacts[idx].phone = e.target.value;
            handleChange({ emergencyContacts: newContacts });
          }} />
        </div>
      ))}
      <button onClick={addEmergencyContact}>Add Contact</button>
      <button onClick={nextStep}>Next</button>
    </div>
  );
}
