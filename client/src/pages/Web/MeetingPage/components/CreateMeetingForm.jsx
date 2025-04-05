import React, { useState } from "react";

const CreateMeetingForm = ({ onCreate }) => {
  const [receiverId, setReceiverId] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [zoomId, setZoomId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!receiverId || !scheduleTime || !zoomId) {
      alert("Please fill in all fields.");
      return;
    }

    const newMeeting = {
      receiverId,
      scheduleTime,
      zoomId,
    };

    onCreate(newMeeting);

    // Clear form
    setReceiverId("");
    setScheduleTime("");
    setZoomId("");
  };

  return (
    <form className="create-meeting-form" onSubmit={handleSubmit}>
      <div className="create-meeting-inputs">
        <input
          type="text"
          placeholder="Receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
        <input
          type="datetime-local"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
        />
        <input
          type="text"
          placeholder="Zoom ID"
          value={zoomId}
          onChange={(e) => setZoomId(e.target.value)}
        />
      </div>
      <button type="submit">Create Meeting</button>
    </form>
  );
};

export default CreateMeetingForm;
