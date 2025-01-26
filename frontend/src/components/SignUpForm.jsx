import React, { useState } from 'react';
import axiosInstance from "../api/axios"; // Use Axios instance
import '../styles/SignUpForm.css';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({}); // Store field-specific errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/register/", formData);
      
      setSuccess(true); 
      setErrors({}); 
      alert(response.data.message); 
      window.location.href = "/"; 
    } catch (err) {
      // Handle errors from the backend
      if (err.response?.data) {
        setErrors(err.response.data); // Display field-specific errors
      } else {
        setErrors({ general: "An unexpected error occurred. Please try again." });
      }
    }
  };

  return (
    <div className="sign-up-form">
      <h2>Create a new account</h2>
      {success && <p className="success-message">Registration successful!</p>}
      <form onSubmit={handleSignUp}>
        <label htmlFor="username">Please enter your username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Please enter your username"
          value={formData.username}
          onChange={handleInputChange}
        />
        {errors.username && <p className="error-message">{errors.username}</p>}

        <label htmlFor="email">Please enter your email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Please enter your email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <label htmlFor="password">Please enter password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Please enter password"
          value={formData.password}
          onChange={handleInputChange}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        {errors.general && <p className="error-message">{errors.general}</p>}

        <button type="submit" className="sign-up-button">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
};

export default SignUpForm;
