import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProjectCard.css';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <Link to={`/project/${project.id}/${project.title}`} className="project-title">
        Project {project.title}
      </Link>
      <p>Due: {project.due_date}</p>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${project.progress}%` }}>
          {project.progress}%
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
