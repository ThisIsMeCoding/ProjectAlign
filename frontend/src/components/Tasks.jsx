import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Tasks.css";

const Tasks = ({ tasks, projectId, projectName, isOwner }) => {
  const navigate = useNavigate();

  const handleAddTask = () => {
    navigate(`/tasks/add/${projectId}/${projectName}`); // Navigate to Add Task page with project name
  };

  return (
    <div className="tasks-section">
      <h3>Tasks</h3>
      <div className="tasks-list">
        {tasks.map((task, index) => (
          <div className={`task-card ${task.status}`} key={index}>
            <h4>{task.title}</h4>
            <p>
              <strong>Assigned to:</strong> {task.assigned_to}
            </p>
            <p>
              <strong>Due date:</strong> {task.due_date}
            </p>
          </div>
        ))}
      </div>
      <button 
      className="add-task-button" 
      onClick={handleAddTask}
      disabled={!isOwner}
      style={{
        cursor: !isOwner ? "not-allowed" : "pointer",
        opacity: !isOwner ? 0.6 : 1,
      }}>
        ADD TASK
      </button>
    </div>
  );
};

export default Tasks;
