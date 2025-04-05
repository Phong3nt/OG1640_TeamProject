import React from "react";

const MeetingCard = ({ meeting, onViewDetail }) => (
    <div className="meeting-card" onClick={() => onViewDetail(meeting)}>
        <p><strong>{meeting.senderName}</strong> → <strong>{meeting.receiverName}</strong></p>
        <p>{new Date(meeting.scheduleTime).toLocaleString()}</p>
    </div>
);

export default MeetingCard;
