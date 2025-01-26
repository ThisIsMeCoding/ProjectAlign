import React from "react";
import "../styles/ProjectInfo.css";

const ProjectInfo = ({ project }) => {
  return (
    <div className="project-info">
      <h1> Project name: {project.name} </h1>
      <p><strong>Owner:</strong> {project.owner}</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
      </div>
      <p><strong>Progress:</strong> {project.progress}%</p>
      <p><strong>Due:</strong> {project.dueDate}</p>
    </div>
  );
};

export default ProjectInfo;
