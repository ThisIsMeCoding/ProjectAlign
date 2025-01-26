import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import Sidebar from "../components/Sidebar";
import "../styles/AddTask.css";
import axiosInstance from "../api/axios";

const AddTask = () => {
  const { projectId,projectName } = useParams(); 
  const [project, setProject] = useState(null);
  const [task, setTask] = useState({
    title: "",
    description: "",
    assigned_to: "",
    due_date: "",
  });

  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Fetch project participants
    const fetchParticipants = async () => {
      try {
        const response = await axiosInstance.get(`/projects/${projectId}/details/`);
        setProject(response.data)
        setParticipants(response.data.participants);
      } catch (error) {
        console.error("Error fetching participants:", error.response?.data || error.message);
      }
    };

    fetchParticipants();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSave = async () => {
    if (!task.title || !task.assigned_to || !task.due_date) {
      alert("Please fill all required fields! ");
      return;
    }
    try {
      const requestData = {
        title : task.title,
        description: task.description,
        assigned_to: task.assigned_to,
        due_date: task.due_date,
        project: projectName,
      };
      const response = await axiosInstance.post("/tasks/create/", requestData);
      alert("Task created successfully!");
      console.log("Response:", response.data);
      handleCancel();
    } catch (error){
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to create task.");
    }
  };

  const handleCancel = () => {
    // Reset the form or navigate back to the previous page
    setTask({ title: "", description: "", assigned_to: "", due_date: "" });
  };

  return (
    <div className="add-task-page">
      <Sidebar />
      <div className="add-task-content">
        <h1> Add Task</h1>

        {/* Display Project Name */}
        <div className="project-name">
          <h2>Project: {projectName}</h2>
        </div>

        <form className="add-task-form">
          <label>
            Task title:
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Enter task title"
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Enter task description"
            />
          </label>
          <label>
            Assign to:
            <select
              name="assigned_to"
              value={task.assigned_to}
              onChange={handleChange}
            >
              <option value="">Select participant</option>
              {participants.map((participant) => (
                <option key={participant} value={participant}>
                  {participant}
                </option>
              ))}
            </select>
          </label>
          <label>
            Due date:
            <input
              type="date"
              name="due_date"
              value={task.due_date}
              onChange={handleChange}
            />
          </label>
          <div className="form-buttons">
            <button type="button" className="save-button" onClick={handleSave}>
              SAVE TASK
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

export default AddTask;
