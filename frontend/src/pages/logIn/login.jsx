import "./login.css";
import UserNavBar from "../../components/homeNavBar";
import { fontFamily } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = async () => {
    console.log("Sending login for:", email, password);

    try {const res = await fetch("http://localhost:5001/api/login/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        alert("Invalid credentials");
        return;
      }


      const data = await res.json();

      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (data.role === "employee") {
        navigate("/employeeProfile")
      }
      
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed.");
    }
  };

  return (
    <>
      <UserNavBar />
      <div className="login-container">
        <div className="login-box">
          <h2>Login Portal</h2>
          <div className="input-row">
            <p>Email</p>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-row">
            <p>Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="login-button"
            style={{ fontFamily: "Bell MT", fontSize: "12pt" }}
            onClick={handleLogin}
          >
            Log in
          </button>
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
          <p className="forgot-password">
            Forgot Password? <a href="/signup">Reset Password</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
