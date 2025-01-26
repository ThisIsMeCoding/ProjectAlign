import React from 'react';
import SidePanel from '../components/SidePanel';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <SidePanel />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
