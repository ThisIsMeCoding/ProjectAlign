import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProjectInfo from "../components/ProjectInfo";
import Participants from "../components/Participants";
import Tasks from "../components/Tasks";
import axiosInstance from "../api/axios";
import "../styles/ProjectDetails.css";

const ProjectDetails = () => {
  const { projectId, projectName } = useParams(); 
  const [project, setProject] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 


  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await axiosInstance.get(`/projects/${projectId}/details/`);
        setProject(projectResponse.data);
        setParticipants(projectResponse.data.participants);

        const tasksResponse = await axiosInstance.get(`/tasks/${projectId}/list/`);
        setTasks(tasksResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project details:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to fetch project details.");
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }



  return (
    <div className="project-details">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="project-details-content">
        <ProjectInfo project={project} />
        <div className="details-sections">
          <Participants participants={participants} projectId={project.id} projectName={project.name} isOwner={project.isOwner} />
          <Tasks tasks={tasks} projectId={project.id} projectName={project.name} isOwner={project.isOwner}/>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
