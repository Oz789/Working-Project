import React from 'react';

export default function AdditionalDetailsForm({ prevStep, values }) {
  const handleSubmit = () => {
    // Placeholder - hook this up to your API later
    console.log('Submitting form data: ', values);
    alert('Form submitted!');
  };

  return (
    <div>
      <h2>Additional Details</h2>
      <textarea placeholder="Allergies" value={values.allergies} onChange={(e) => values.allergies = e.target.value} />
      <textarea placeholder="Additional Notes" value={values.additionalDetails} onChange={(e) => values.additionalDetails = e.target.value} />

      <div className="nav-buttons">
        <button onClick={prevStep}>Back</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
