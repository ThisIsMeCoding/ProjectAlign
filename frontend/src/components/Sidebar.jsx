import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaTasks, FaSignOutAlt } from 'react-icons/fa'; // Importing icons
import axiosInstance from "../api/axios";
import '../styles/Sidebar.css';

const Sidebar = () => {
  const navigate= useNavigate();

  const handleLogout = async () =>{
    try {
      await axiosInstance.post("/auth/logout/");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/");
    }
  };

  const links = [
    { name: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
    { name: 'Tasks', icon: <FaTasks />, path: '/tasks' },
  ];

  return (
    <div className="sidebar">
      {links.map((link, index) => (
        <NavLink 
          key={index} 
          to={link.path} 
          className="sidebar-link" 
          activeClassName="active-link"
        >
          <div className="icon">{link.icon}</div>
          <span className="link-name">{link.name}</span>
        </NavLink>
      ))}
      <div className="sidebar-logout">
        <button onClick={handleLogout} className="sidebar-link">
          <div className="icon"><FaSignOutAlt /></div>
          <span className="link-name">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
