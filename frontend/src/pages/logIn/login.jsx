import "./login.css";

const Login = () => (
  <div className="login-container">  {/* Wrapper for centering */}
    <div className="login-box">
      <h2>Login Portal</h2>
      <div className="input-row">
        <p>Username/Email</p>
        <input type="text" />
      </div>
      <div className="input-row">
        <p>Password</p>
        <input type="password" />
      </div>
      <button className= "login-button">Login</button>
      <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      <p className="forgot-password">Forgot Password? <a href="/signup">Reset Password</a></p>
    </div>
  </div>
);

export default Login;
