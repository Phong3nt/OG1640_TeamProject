import React from "react";
import "../MeetingPage.css";

const TutorLogs = ({ logs = [], meetingId }) => {
    const logsForThisMeeting = logs[meetingId] || [];

    if (logsForThisMeeting.length === 0) {
        return <p style={{ fontStyle: "italic", color: "#666" }}>No logs available for this meeting.</p>;
    }

    return (
        <div className="logs-section">
            <h4>Logs for Meeting #{meetingId}</h4>
            <ul className="logs-list">
                {logsForThisMeeting.map((log, index) => (
                    <li key={index}>
                        <span className="log-time">{log.time}</span>
                        <span className="log-action">{log.action}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TutorLogs;
