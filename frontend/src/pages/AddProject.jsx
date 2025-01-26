import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import Sidebar from "../components/Sidebar";
import "../styles/AddProject.css";
import axiosInstance from "../api/axios";

const AddProject = () => {
  const { projectId, projectName } = useParams(); 
  const [project, setProject] = useState({
    name: projectName || "",
    owner: "",
    dueDate: "",
    description: "",
    participants: [],
  });

  const [newParticipant, setNewParticipant] = useState("");

  useEffect(() => {
    if (projectId) {
      // Fetch existing project details if editing
      const fetchProjectDetails = async () => {
        try {
          const response = await axiosInstance.get(`/projects/${projectId}/details/`);
          setProject({
            name: response.data.name,
            owner: response.data.owner,
            dueDate: response.data.dueDate,
            description: response.data.description,
            participants: response.data.participants,
          });
        } catch (error) {
          console.error("Error fetching project details:", error.response?.data || error.message);
        }
      };

      fetchProjectDetails();
    }
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleAddParticipant = () => {
    if (newParticipant.trim() !== "") {
      setProject({
        ...project,
        participants: [...project.participants, newParticipant],
      });
      setNewParticipant("");
    }
  };

  const handleRemoveParticipant = (participant) => {
    setProject({
      ...project,
      participants: project.participants.filter((p) => p !== participant),
    });
  };

  const handleSave = async () => {
    if (!project.name || !project.owner || !project.dueDate) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      const requestData = {
        title: project.name,
        owner: project.owner,
        due_date: project.dueDate,
        description: project.description,
        participants: project.participants,
      };

      if (projectId) {
        await axiosInstance.put(`/projects/${projectId}/update/`, requestData); // Update existing project
        alert("Project updated successfully!");
      } else {
        await axiosInstance.post("/projects/create/", requestData); // Create new project
        alert("Project created successfully!");
      }
    } catch (error) {
      console.error("Error saving project:", error.response?.data || error.message);
      alert("Failed to save project.");
    }
  };

  const handleCancel = () => {
    setProject({
      name: "",
      owner: "",
      dueDate: "",
      description: "",
      participants: [],
    });
    setNewParticipant("");
  };

  return (
    <div className="add-project-page">
      <Sidebar />
      <div className="add-project-form-container">
        <h1>{projectId ? "Update Project" : "Add Project"}</h1>
        <form className="add-project-form">
          <label>
            Project name:
            <input
              type="text"
              name="name"
              value={project.name}
              onChange={handleInputChange}
              placeholder="Enter project name"
            />
          </label>
          <label>
            Project owner:
            <input
              type="text"
              name="owner"
              value={project.owner}
              onChange={handleInputChange}
              placeholder="Enter owner name"
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={project.description}
              onChange={handleInputChange}
              placeholder="Enter project description"
              rows="4"
            ></textarea>
          </label>
          <label>
            Due date:
            <input
              type="date"
              name="dueDate"
              value={project.dueDate}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Participants:
            <div className="participants-input">
              <input
                type="text"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                placeholder="Enter participant email"
              />
              <button type="button" className="add-participant-button" onClick={handleAddParticipant}>
                +
              </button>
            </div>
            <ul className="participants-list">
              {project.participants.map((participant, index) => (
                <li key={index}>
                  {participant}
                  <button type="button" onClick={() => handleRemoveParticipant(participant)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </label>
          <div className="form-buttons">
            <button type="button" className="save-button" onClick={handleSave}>
              SAVE PROJECT
            </button>
            <button type="button" className="cancel-button" onClick={handleCancel}>
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
