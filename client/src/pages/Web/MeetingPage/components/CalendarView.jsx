import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/en-gb";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../../../../utils/axios"; // Import the centralized Axios instance
import MeetingDetailModal from "./MeetingDetailModal"; // Import the existing modal

moment.locale("en");
const localizer = momentLocalizer(moment);

const CalendarView = ({ onSelectMeeting }) => {
  const [meetings, setMeetings] = useState([]); // State to store meetings
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event

  // Fetch meetings from the API
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await api.get("/meetings"); // Fetch meetings from the API
        setMeetings(res.data.meetings || []); // Set the meetings in state
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  // Events for the calendar
  const events = meetings.map((m) => ({
    ...m,
    title: m.title,
    start: new Date(m.date), // Use the "date" field from the database
    end: new Date(new Date(m.date).getTime() + m.duration * 60 * 1000), // Add duration to calculate end time
  }));

  const dayPropGetter = (date) => {
    const isToday = moment(date).isSame(moment(), "day");
    const hasMeeting = meetings.some((m) =>
      moment(m.date).isSame(moment(date), "day")
    );

    if (isToday) {
      return { style: { backgroundColor: "#ADD8E6" } }; // Blue for today
    }

    if (hasMeeting) {
      return { style: { backgroundColor: "#FFFFE0" } }; // Yellow for days with meetings
    }

    return {}; // Default style
  };

  const handleJoinMeeting = (meeting) => {
    window.open(`https://meet.jit.si/${meeting.meetingRoom}`, "_blank");
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await api.delete(`/meetings/${meetingId}`);
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting._id !== meetingId)
      );
      setSelectedEvent(null); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  // Handle month change
  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    const newDate = new Date(currentDate);
    newDate.setMonth(newMonth);
    setCurrentDate(newDate);
  };

  // Handle year change
  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    const newDate = new Date(currentDate);
    newDate.setFullYear(newYear);
    setCurrentDate(newDate);
  };

  // Generate month and year options
  const months = moment.months();
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div className="calendar-container">
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
        Meeting Calendar
      </h3>

      {/* Month and Year Selectors */}
      <div className="calendar-controls" style={{ textAlign: "center", marginBottom: "10px" }}>
        <select
          value={currentDate.getMonth()}
          onChange={handleMonthChange}
          style={{ marginRight: "10px" }}
        >
          {months.map((month, idx) => (
            <option key={month} value={idx}>
              {month}
            </option>
          ))}
        </select>
        <select value={currentDate.getFullYear()} onChange={handleYearChange}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        defaultView="month"
        views={["month"]}
        date={currentDate}
        onNavigate={(date) => {
          setCurrentDate(date);
          setSelectedDate(null);
        }}
        onSelectEvent={(event) => setSelectedEvent(event)} // Set the selected event
        selectable
        popup
        style={{
          height: 600,
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "10px",
        }}
        dayPropGetter={dayPropGetter}
      />

      {/* Reuse MeetingDetailModal */}
      {selectedEvent && (
        <MeetingDetailModal
          meeting={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          onJoin={handleJoinMeeting} 
          onDelete={handleDeleteMeeting} 
        />
      )}
    </div>
  );
};

export default CalendarView;