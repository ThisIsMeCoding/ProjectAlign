import React, { useState, useEffect } from "react";
import "../styles/Invitations.css";
import axiosInstance from "../api/axios";

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch invitations from the backend
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await axiosInstance.get("/projects/invitations/list/");
        setInvitations(response.data); 
      } catch (error) {
        console.error("Error fetching invitations:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  // Accept an invitation
  const handleAccept = async (token) => {
    try {
      await axiosInstance.get(`/projects/invitations/accept/${token}/`);
      alert("Invitation accepted!");
      setInvitations(invitations.filter((invitation) => invitation.token !== token));
    } catch (error) {
      console.error("Error accepting invitation:", error.response?.data || error.message);
      alert("Failed to accept invitation.");
    }
  };

  // Decline an invitation
  const handleDecline = async (token) => {
    try {
      await axiosInstance.get(`/projects/invitations/decline/${token}/`);
      alert("Invitation declined.");
      setInvitations(invitations.filter((invitation) => invitation.token !== token));
    } catch (error) {
      console.error("Error declining invitation:", error.response?.data || error.message);
      alert("Failed to decline invitation.");
    }
  };

  if (loading) {
    return <p>Loading invitations...</p>;
  }

  return (
    <div className="invitations">
      <h2>My invitations</h2>
      <div className="invitation-list">
        {invitations.length > 0 ? (
          invitations.map((invitation, index) => (
            <div className="invitation-item" key={index}>
              <div className="invitation-info">
                <p><strong>Project:</strong> {invitation.project}</p>
                <p><strong>Owner:</strong> {invitation.owner}</p>
              </div>
              <div className="invitation-actions">
                <button
                  className="accept-button"
                  onClick={() => handleAccept(invitation.token)}
                >
                  ACCEPT
                </button>
                <button
                  className="decline-button"
                  onClick={() => handleDecline(invitation.token)}
                >
                  DECLINE
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No invitations at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Invitations;
