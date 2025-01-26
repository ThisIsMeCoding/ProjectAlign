import React, { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import '../styles/ProjectSection.css';

const ProjectSection = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const fetchProjects = async() => {
      try {
        const response = await axiosInstance.get("/projects/list/");
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch projects");
        setLoading(false);
      }
    };

    fetchProjects();
  })
  
  const handleAddProject = () => {
    navigate(`/projects/add`);
  };

  if (loading){
    return <p>Loading projects ...</p>;
  }

  if (error){
    return <p className="error-message">{error}</p>;

  }
  return (
    <div className="project-section">
      <h2>My projects</h2>
      <div className="projects-container">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <div className="add-project-card">
          <button className="add-project-button"onClick={handleAddProject}>+</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;
