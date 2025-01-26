import React, { useEffect, useState } from 'react';
import axiosInstance from "../api/axios";
import '../styles/TaskList.css';

const TaskList = () => {
  const [tasks, setTasks]=useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const fetchTasks = async() => {
      try {
        const response = await axiosInstance.get("/tasks/list/");
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch tasks");
        setLoading(false);
      }
    };

    fetchTasks();
  })

  if (loading){
    return <p>Loading tasks ...</p>;
  }

  if (error){
    return <p className="error-message">{error}</p>;
  }

  const sortedTasks = tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  return (
    <div className="task-list">
    <h2>My tasks</h2>
    <div className="tasks">
      {sortedTasks.map((task, index) => (
        <div className="task" key={index}>
          <p className='task-name'>{task.title}</p>
          <p>Project: {task.project}</p>
          <p>Due date: {task.due_date}</p>
          <p>Status: {task.status}</p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default TaskList;
