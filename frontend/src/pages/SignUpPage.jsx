import React from 'react';
import SidePanel from '../components/SidePanel';
import SignUpForm from '../components/SignUpForm';
import '../styles/SignUpPage.css';

const SignUpPage = () => {
  return (
    <div className="sign-up-page">
      <SidePanel />
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
