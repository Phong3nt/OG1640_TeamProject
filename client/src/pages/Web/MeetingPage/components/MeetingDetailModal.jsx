import React, { useState } from "react";
import "../MeetingPage.css";

const MeetingDetailModal = ({ meeting, onClose, onUpdate, onViewLogs, currentUser }) => {
    const [zoomId, setZoomId] = useState(meeting.zoomId || "");
    const [recordingURL, setRecordingURL] = useState(meeting.recordingURL || "");

    const isTutor = currentUser.role === "tutor";

    const handleSave = () => {
        const updated = {
            ...meeting,
            zoomId,
            recordingURL,
            updatedAt: new Date().toISOString(),
        };
        onUpdate(updated);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Meeting Details</h3>

                <p><strong>Meeting ID:</strong> {meeting.meetingId}</p>
                <p><strong>Sender:</strong> {meeting.senderName}</p>
                <p><strong>Receiver:</strong> {meeting.receiverName}</p>
                <p><strong>Schedule:</strong> {new Date(meeting.scheduleTime).toLocaleString()}</p>

                {isTutor ? (
                    <>
                        <div className="form-group">
                            <label>Zoom ID</label>
                            <input
                                type="text"
                                value={zoomId}
                                onChange={(e) => setZoomId(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Recording Link</label>
                            <input
                                type="url"
                                value={recordingURL}
                                onChange={(e) => setRecordingURL(e.target.value)}
                            />
                        </div>

                        <div className="button-group">
                            <button className="button button-primary" onClick={handleSave}>Save</button>
                            <button className="button button-outline" onClick={() => onViewLogs(meeting.meetingId)}>View Logs</button>
                            <button className="button button-outline" onClick={onClose}>Cancel</button>
                        </div>
                    </>
                ) : (
                    <>
                        <p><strong>Zoom ID:</strong> {zoomId || "Not set"}</p>
                        <p>
                            <strong>Recording:</strong>{" "}
                            {recordingURL ? (
                                <a href={recordingURL} target="_blank" rel="noreferrer" style={{ color: "#007bff" }}>
                                    {recordingURL}
                                </a>
                            ) : (
                                "Not available"
                            )}
                        </p>
                        <div className="button-group single-button">
                            <button className="button button-outline" onClick={onClose}>Close</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MeetingDetailModal;
