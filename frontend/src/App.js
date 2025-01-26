import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import MyTasks from './pages/MyTasks';
import AddTask from './pages/AddTask';
import AddProject from './pages/AddProject';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:projectId/:projectName" element={<ProjectDetails />} />
        <Route path="/tasks" element={<MyTasks />} />
        <Route path="/tasks/add/:projectId/:projectName" element={<AddTask />} />
        <Route path="/projects/add" element={<AddProject />} />
        <Route path="/projects/update/:projectId/:projectName" element={<AddProject />} />
      </Routes>
    </Router>
  );
}

export default App;
