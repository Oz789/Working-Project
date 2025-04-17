import "./login.css";
import UserNavBar from "../../components/navBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PatternFormat } from 'react-number-format';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    DOB: "",
    sex: "Male",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isPasswordValid = (pwd) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);
  };

  const handleRegister = async () => {
    const { password } = form;

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (!isPasswordValid(password)) {
      return setError("Password must be at least 8 characters, contain one uppercase letter and one number.");
    }

    setError(""); // Clear any previous errors

    try {
      const res = await fetch("http://localhost:5001/api/register-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Patient registered successfully.");
        navigate("/log-in"); 
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Failed to register.");
    }
  };

  return (
    <>
      <UserNavBar />
      <div className="login-page">
        <div className="login-container">
          <div className="login-box">
            <h2 className="login-title">Create Patient Account</h2>

            {[
              { label: "First Name", name: "firstName" },
              { label: "Last Name", name: "lastName" },
              { label: "DOB", name: "DOB", type: "date" },
              {
                label: "Sex",
                name: "sex",
                type: "select",
                options: ["Male", "Female", "Other"],
              },
              { label: "Address", name: "address" },
              { label: "Phone Number", name: "phoneNumber", type: "phone" },
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
            ].map(({ label, name, type = "text", options }) => (
              <div key={name} className="input-row">
                <p>{label}:</p>
                {type === "select" ? (
                  <select name={name} value={form[name]} onChange={handleChange} className="input-field">
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : type === "phone" ? (
                  <PatternFormat
                    format="###-###-####"
                    allowEmptyFormatting
                    mask="_"
                    value={form[name]}
                    onValueChange={(values) => {
                      setForm(prev => ({ ...prev, [name]: values.formattedValue }));
                    }}
                    className="input-field"
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="input-field"
                  />
                )}
              </div>
            ))}


            <div className="input-row">
              <p>Confirm Password:</p>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
              />
            </div>

            {error && <p style={{ color: "#d32f2f", fontWeight: "bold" }}>{error}</p>}

            <button className="login-button" onClick={handleRegister}>
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPatient;

