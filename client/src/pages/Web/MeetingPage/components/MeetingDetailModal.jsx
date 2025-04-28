import React from "react";
import "../MeetingPage.css"; // Import the CSS file for styling

const MeetingDetailModal = ({
  meeting,
  currentUserRole,
  onClose,
  onJoin,
  onDelete,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">{meeting.title}</h2>
        <div className="modal-content">
          <p>
            <strong>Date:</strong> {new Date(meeting.date).toLocaleString()}
          </p>
          <p>
            <strong>Duration:</strong> {meeting.duration} minutes
          </p>
          <p>
            <strong>Participants:</strong>
          </p>
          <ul>
            {meeting.participants.map((participant) => (
              <li key={participant._id}>{participant.fullName}</li>
            ))}
          </ul>
        </div>
        <div className="modal-actions">
          <button className="btn btn-join" onClick={() => onJoin(meeting)}>
            Join
          </button>
          {currentUserRole !== "student" && (
            <button
              className="btn btn-delete"
              onClick={() => onDelete(meeting._id)}
            >
              Delete
            </button>
          )}
          <button className="btn btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailModal;
