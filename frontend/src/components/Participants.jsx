import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Importing the user icon
import "../styles/Participants.css";

const Participants = ({ participants, projectId, projectName }) => {
  const navigate = useNavigate(); 

  const handleAddParticipants = () => {
    navigate(`/projects/update/${projectId}/${projectName}`);
  };
  return (
    <div className="participants-section">
      <h3>Participants</h3>
      <ul className="participants-list">
        {participants.map((participant, index) => (
          <li key={index} className="participant-item">
            <FaUserCircle className="participant-icon" />
            <span className="participant-name">{participant}</span>
          </li>
        ))}
      </ul>
      <button className="add-participants-button" onClick={handleAddParticipants}>ADD PARTICIPANTS</button>
    </div>
  );
};

export default Participants;
