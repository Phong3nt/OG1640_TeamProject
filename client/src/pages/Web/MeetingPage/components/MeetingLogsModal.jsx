import React from "react";
import TutorLogs from "./TutorLogs";
import "../MeetingPage.css";

const MeetingLogsModal = ({ logs, meetingId, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Logs for Meeting #{meetingId}</h3>
                <TutorLogs logs={logs} meetingId={meetingId} />
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button className="button button-outline" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default MeetingLogsModal;
