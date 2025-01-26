import React, { useState, useEffect } from "react";
import "../styles/MyTasks.css";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../api/axios";

const MyTasks = () => {
  const [tasks, setTasks] = useState({
    toDo: [],
    ongoing: [],
    done: [],
  });

  useEffect(() => {
    // Fetch tasks from the backend when the component mounts
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get("/tasks/list");
        const fetchedTasks = response.data;

        // Categorize tasks into columns
        const categorizedTasks = {
          toDo: fetchedTasks.filter((task) => task.status === "toDo"),
          ongoing: fetchedTasks.filter((task) => task.status === "ongoing"),
          done: fetchedTasks.filter((task) => task.status === "done"),
        };

        setTasks(categorizedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error.response?.data || error.message);
      }
    };

    fetchTasks();
  }, []);

  const handleDragStart = (e, taskId, source) => {
    e.dataTransfer.setData("taskId", String(taskId)); // Ensure taskId is a string
    e.dataTransfer.setData("source", source);
  };

  const handleDrop = async (e, destination) => {
    const taskId = e.dataTransfer.getData("taskId");
    const source = e.dataTransfer.getData("source");

    if (source === destination) return;

    // Find the task in the source column
    const task = tasks[source].find((t) => String(t.id) === taskId); // Ensure comparison as strings
    if (!task) {
      console.error("Task not found in source column:", source);
      return;
    }

    const updatedSource = tasks[source].filter((t) => String(t.id) !== taskId);
    const updatedDestination = [...tasks[destination], { ...task, status: destination }];

    setTasks({
      ...tasks,
      [source]: updatedSource,
      [destination]: updatedDestination,
    });

    // Update task status in the backend
    try {
      await axiosInstance.post(`/tasks/${taskId}/update-status/`, {
        status: destination,
      });
    } catch (error) {
      console.error("Error updating task status:", error.response?.data || error.message);

      // Revert changes in case of error
      setTasks({
        ...tasks,
        [source]: [...updatedSource, task],
        [destination]: updatedDestination.filter((t) => String(t.id) !== taskId),
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="my-tasks">
      <Sidebar />
      <h1>My Tasks</h1>
      <div className="kanban-board">
        {Object.keys(tasks).map((columnId) => (
          <div
            key={columnId}
            className={`kanban-column ${columnId}`}
            onDrop={(e) => handleDrop(e, columnId)}
            onDragOver={handleDragOver}
          >
            <h2>
              {columnId === "toDo"
                ? "To Do"
                : columnId === "ongoing"
                ? "Ongoing"
                : columnId === "done"
                ? "Done"
                : ""}
            </h2>

            {tasks[columnId].map((task) => (
              <div
                key={task.id}
                className={`kanban-task ${columnId}-task`}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id, columnId)}
              >
                <h3>{task.title}</h3>
                <p>
                  <strong>Project:</strong> {task.project}
                </p>
                <p>
                  <strong>Due date:</strong> {task.due_date}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
