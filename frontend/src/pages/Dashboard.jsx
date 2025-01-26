import React from 'react';
import Sidebar from '../components/Sidebar';
import ProjectSection from '../components/ProjectSection';
import TaskList from '../components/TaskList';
import Invitations from '../components/Invitations';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <div className="projects-and-tasks">
          <ProjectSection />
          <TaskList />
        </div>
        <Invitations />
      </div>
    </div>
  );
};

export default Dashboard;
