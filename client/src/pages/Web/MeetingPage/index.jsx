import React, { useEffect, useState } from "react";
import CreateMeetingForm from "./components/CreateMeetingForm";
import MeetingDetailModal from "./components/MeetingDetailModal";
import RescheduleModal from "./components/RescheduleModal";
import CalendarView from "./components/CalendarView";
import MeetingLogsModal from "./components/MeetingLogsModal";
import "./MeetingPage.css";

// Giả lập đổi role
const dummyUsers = {
    tutor: { userId: "u001", name: "Tutor A", role: "tutor" },
    student: { userId: "u002", name: "Student B", role: "student" },
};

const MeetingPage = () => {
    const [meetings, setMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [rescheduleMeeting, setRescheduleMeeting] = useState(null);
    const [logs, setLogs] = useState({});
    const [logMeetingId, setLogMeetingId] = useState(null);
    const [currentRole, setCurrentRole] = useState("tutor");

    const currentUser = dummyUsers[currentRole];

    useEffect(() => {
        const dummy = [
            {
                meetingId: 1,
                senderId: "u001",
                receiverId: "u002",
                senderName: "Tutor A",
                receiverName: "Student B",
                scheduleTime: "2025-04-01T10:00",
                zoomId: "123-456-789",
                recordingURL: "https://example.com/rec123",
                createAt: "2025-03-25T10:00",
            },
        ];
        setMeetings(dummy);
    }, []);

    const filteredMeetings = meetings.filter((m) =>
        currentUser.role === "tutor"
            ? m.senderId === currentUser.userId
            : m.receiverId === currentUser.userId
    );

    const handleCreate = (newMeeting) => {
        const fullMeeting = {
            meetingId: Date.now(),
            senderId: currentUser.userId,
            senderName: currentUser.name,
            receiverName: `User ${newMeeting.receiverId}`,
            zoomId: newMeeting.zoomId || "",
            recordingURL: "",
            ...newMeeting,
            createAt: new Date().toISOString(),
        };
        setMeetings([...meetings, fullMeeting]);
    };

    const handleUpdateSchedule = (updatedMeeting) => {
        setMeetings((prev) =>
            prev.map((m) => (m.meetingId === updatedMeeting.meetingId ? updatedMeeting : m))
        );
        setRescheduleMeeting(null);
        setSelectedMeeting(null);
    };

    const handleUpdateMeeting = (updatedMeeting) => {
        setMeetings((prev) =>
            prev.map((m) => (m.meetingId === updatedMeeting.meetingId ? updatedMeeting : m))
        );

        const meetingId = updatedMeeting.meetingId;
        const newLog = {
            time: new Date().toLocaleString(),
            action: `Tutor updated meeting ${meetingId} (Zoom ID / Recording)`,
        };

        setLogs((prevLogs) => ({
            ...prevLogs,
            [meetingId]: [newLog, ...(prevLogs[meetingId] || [])],
        }));
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

            <h1 className="meeting-title">
                <span role="img" aria-label="calendar">🗓️</span> My Meetings
            </h1>

            {currentUser.role === "tutor" && (
                <CreateMeetingForm onCreate={handleCreate} />
            )}

            <CalendarView
                meetings={filteredMeetings}
                onSelectMeeting={setSelectedMeeting}
            />

            {selectedMeeting && (
                <MeetingDetailModal
                    meeting={selectedMeeting}
                    onClose={() => setSelectedMeeting(null)}
                    onUpdate={handleUpdateMeeting}
                    logs={logs}
                    onViewLogs={(meetingId) => {
                        setSelectedMeeting(null);
                        setLogMeetingId(meetingId);
                    }}
                    currentUser={currentUser} // ✅ Truyền user vào
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
