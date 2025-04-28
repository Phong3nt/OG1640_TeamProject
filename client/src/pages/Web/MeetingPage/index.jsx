import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateMeetingForm from "./components/CreateMeetingForm";
import MeetingDetailModal from "./components/MeetingDetailModal";
import CalendarView from "./components/CalendarView";
import MeetingLogsModal from "./components/MeetingLogsModal";
import "./MeetingPage.css";
import api from "../../../utils/axios";

const currentUser = JSON.parse(localStorage.getItem("user"));

const MeetingPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [logs, setLogs] = useState({});
  const [logMeetingId, setLogMeetingId] = useState(null);
  const [allocatedStudents, setAllocatedStudents] = useState([]);
  
  // Fetch all meetings from API
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/meetings");
        setMeetings(res.data.meetings || []);
      } catch (err) {
        console.error("Error fetching meetings:", err);
      }
    };

    fetchMeetings();
  }, []);

  // Fetch allocated students for the current tutor
  useEffect(() => {
    const fetchAllocatedStudents = async () => {
      try {
        if (currentUser.role === "tutor") {
          const res = await axios.get(
            `http://localhost:5000/api/me/allocations/tutor/${currentUser.id}` // Use currentUser.id
          );
          setAllocatedStudents(res.data.students || []);
        }
      } catch (err) {
        console.error("Error fetching allocated students:", err);
      }
    };

    fetchAllocatedStudents();
  }, [currentUser]);

  const filteredMeetings = meetings.filter((m) =>
    currentUser.role === "tutor"
      ? m.host._id === currentUser.id // Use `host._id` for tutors
      : m.participants.some((participant) => participant._id === currentUser.id) // Use `participants` for students
  );

  const handleCreate = async (newMeeting) => {
    try {
      const res = await api.post("/meetings", {
        ...newMeeting,
        senderId: currentUser.id, // Use currentUser.id
        participants: allocatedStudents.map((student) => student._id),
      });
      setMeetings((prevMeetings) => [...prevMeetings, res.data.meeting]);
      window.location.reload();
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await api.delete(`/meetings/${meetingId}`);
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting._id !== meetingId)
      );
      setSelectedMeeting(null);
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  return (
    <div className="meeting-page">
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
          currentUserRole={currentUser.role}
          onClose={() => setSelectedMeeting(null)}
          onDelete={handleDeleteMeeting}
          logs={logs}
          onViewLogs={(meetingId) => {
            setSelectedMeeting(null);
            setLogMeetingId(meetingId);
          }}
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