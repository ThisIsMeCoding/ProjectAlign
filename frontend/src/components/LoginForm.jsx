import React, { useState } from 'react';
import axiosInstance from "../api/axios";
import '../styles/LoginForm.css';

const LoginForm = () => {

  const [credentials, setCredentials]=useState({ username: "", password: ""});
  const [error,setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login/", credentials);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      alert("Login successful!");
      window.location.href = "/dashboard"; // Redirect to the dashboard
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <p>Sign in to continue</p>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input 
        type="text" 
        id="username" 
        name="username" 
        placeholder="Username"
        value={credentials.username}
        onChange={handleInputChange}
        />
        
        <label htmlFor="password">Password</label>
        <input 
        type="password" 
        id="password" 
        name="password" 
        placeholder="Password" 
        value={credentials.password}
        onChange={handleInputChange}
        />
        
        <div className="form-footer">
          <a href="/forgot-password">Forgot password?</a>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </div>
      </form>
      <p>
        Don’t have an account? <a href="/signup">Register</a>
      </p>
    </div>
  );
};

export default LoginForm;
