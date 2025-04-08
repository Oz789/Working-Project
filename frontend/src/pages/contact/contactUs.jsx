import React, { useState } from "react";
import axios from "axios";
import UserNavbar from "../../components/navBar";
import "./contact.css";

const ContactP = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/submit-form", formData);
      setStatus(res.data.message);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      if (error.response) {
        setStatus(error.response.data.error || "Error submitting form. Please try again.");
      } else {
        setStatus("Error submitting form. Please try again.");
      }
    }
  };

  return (
    <>
      <UserNavbar />

      <div className="contact-page">
        <h1 className="contact-title">Contact Us</h1>
        <div className="contact-grid">
          
          {/* Left Box */}
          <div className="contact-box">
            <h2>Clinic Information</h2>
            <p>At our Clinic, we are committed to providing the highest standard of eye care for all of our patients. Your health and well-being are our top priorities, and we value your input as we strive to continually improve our services.</p>

            <p><strong>Office Hours:</strong><br />
              Monday – Friday: 8:00 AM – 5:00 PM<br />
              Saturday & Sunday: Closed<br />
              Physician On Call: 24/7 for emergencies
            </p>

            <p><strong>Contact Us:</strong><br />
              We encourage you to reach out for any inquiries or to provide feedback about your experience. Your input helps us maintain and improve the care we provide to all our patients.<br />
              <strong>Phone:</strong> (713) 486-9400<br />
              <strong>Fax:</strong> (713) 486-9593
            </p>

            <p>Please don’t hesitate to contact us if you need assistance with appointments, prescription refills, insurance questions, or have any other concerns. Our team is here to help!</p>
          </div>

          {/* Right Box */}
          <div className="contact-box">
            <h2>Send A Message</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                required
              ></textarea>
              <button type="submit">Send</button>
              {status && <p className="status-message">{status}</p>}
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default ContactP;
