import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateMeetingForm from "./components/CreateMeetingForm";
import MeetingDetailModal from "./components/MeetingDetailModal";
import RescheduleModal from "./components/RescheduleModal";
import CalendarView from "./components/CalendarView";
import MeetingLogsModal from "./components/MeetingLogsModal";
import "./MeetingPage.css";

const MeetingPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [rescheduleMeeting, setRescheduleMeeting] = useState(null);
  const [logs, setLogs] = useState({});
  const [logMeetingId, setLogMeetingId] = useState(null);
  const [currentRole, setCurrentRole] = useState("tutor");

  const currentUser = JSON.parse(localStorage.getItem("user")); // hoặc dùng context

  // Fetch all meetings from API
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/meeting");
        setMeetings(res.data.meetings || []);
      } catch (err) {
        console.error("Error fetching meetings:", err);
      }
    };

    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter((m) =>
    currentUser.role === "tutor"
      ? m.senderId === currentUser.userId
      : m.receiverId === currentUser.userId
  );

  const handleCreate = async (newMeeting) => {
    try {
      const res = await axios.post("http://localhost:5000/api/meeting", {
        ...newMeeting,
        senderId: currentUser.userId,
      }, {
        headers: {
          Authorization: "Bearer yourTokenHere", // thêm nếu có auth
        },
      });
      setMeetings([...meetings, res.data.meeting]);
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  const handleUpdateSchedule = async (updatedMeeting) => {
    try {
      await axios.put(`http://localhost:5000/api/meeting/${updatedMeeting.meetingId}`, updatedMeeting);
      setMeetings((prev) =>
        prev.map((m) => (m.meetingId === updatedMeeting.meetingId ? updatedMeeting : m))
      );
      setRescheduleMeeting(null);
      setSelectedMeeting(null);
    } catch (err) {
      console.error("Error updating schedule:", err);
    }
  };

  const handleUpdateMeeting = async (updatedMeeting) => {
    try {
      await axios.put(`http://localhost:5000/api/meeting/${updatedMeeting.meetingId}`, updatedMeeting);
      setMeetings((prev) =>
        prev.map((m) => (m.meetingId === updatedMeeting.meetingId ? updatedMeeting : m))
      );

      const meetingId = updatedMeeting.meetingId;
      const newLog = {
        time: new Date().toLocaleString(),
        action: `Tutor updated meeting ${meetingId}`,
      };

      setLogs((prevLogs) => ({
        ...prevLogs,
        [meetingId]: [newLog, ...(prevLogs[meetingId] || [])],
      }));
    } catch (err) {
      console.error("Error updating meeting:", err);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/meeting/${meetingId}`);
      setMeetings((prev) => prev.filter((m) => m.meetingId !== meetingId));
      setSelectedMeeting(null);
    } catch (err) {
      console.error("Error deleting meeting:", err);
    }
  };

  return (
    <div className="meeting-page">
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <label><strong>Switch User:</strong></label>
        <select value={currentRole} onChange={(e) => setCurrentRole(e.target.value)}>
          <option value="tutor">Tutor</option>
          <option value="student">Student</option>
        </select>
      </div>

      <h1 className="meeting-title">📅 My Meetings</h1>

      {currentUser.role === "tutor" && (
        <div className="create-meeting-button">
          <h2>Create New Meeting</h2>
          <CreateMeetingForm onCreate={handleCreate} />
        </div>
      )}

      <CalendarView
        meetings={filteredMeetings}
        onSelectMeeting={setSelectedMeeting}
      />

      {selectedMeeting && (
        <MeetingDetailModal
          meeting={selectedMeeting}
          currentUser={currentUser}
          onClose={() => setSelectedMeeting(null)}
          onUpdate={handleUpdateMeeting}
          onDelete={handleDeleteMeeting}
          logs={logs}
          onViewLogs={(meetingId) => {
            setSelectedMeeting(null);
            setLogMeetingId(meetingId);
          }}
        />
      )}

      {rescheduleMeeting && (
        <RescheduleModal
          meeting={rescheduleMeeting}
          onCancel={() => setRescheduleMeeting(null)}
          onUpdate={handleUpdateSchedule}
        />
      )}

      {logMeetingId && (
        <MeetingLogsModal
          meetingId={logMeetingId}
          logs={logs}
          onClose={() => setLogMeetingId(null)}
        />
      )}
    </div>
  );
};

export default MeetingPage;
