import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/en-gb";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en");
const localizer = momentLocalizer(moment);

const CalendarView = ({ meetings, onSelectMeeting }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Lịch sự kiện từ props meetings
  const events = meetings.map((m) => ({
    ...m,
    title: `Zoom: ${m.zoomId}`,
    start: new Date(m.scheduleTime),
    end: new Date(new Date(m.scheduleTime).getTime() + 60 * 60 * 1000),
  }));

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    const newDate = new Date(currentDate);
    newDate.setMonth(newMonth);
    setCurrentDate(newDate);
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    const newDate = new Date(currentDate);
    newDate.setFullYear(newYear);
    setCurrentDate(newDate);
  };

  const months = moment.months();
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  // Lấy meeting trong ngày
  const meetingsOnDate = selectedDate
    ? meetings.filter((m) =>
        moment(m.scheduleTime).isSame(moment(selectedDate), "day")
      )
    : [];

  return (
    <div className="calendar-container">
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Meeting Calendar</h3>

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
        onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)}
        onSelectEvent={(event) => onSelectMeeting(event)}
        selectable
        popup
        style={{ height: 600, backgroundColor: "#fff", borderRadius: "8px", padding: "10px" }}
      />

      {selectedDate && (
        <div className="meeting-day-list">
          <h3>Meetings on {moment(selectedDate).format("DD/MM/YYYY")}</h3>
          {meetingsOnDate.length === 0 ? (
            <p>No meetings for this day.</p>
          ) : (
            meetingsOnDate.map((m) => (
              <div
                key={m.meetingId}
                className="meeting-day-item"
                onClick={() => onSelectMeeting(m)}
              >
                <strong>{m.senderName}</strong> → {m.receiverName} | Zoom ID: {m.zoomId}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
