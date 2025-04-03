import React, { useEffect, useState } from "react";
import axios from "axios";

export const MeetingReports = () => {
  const [meetingStats, setMeetingStats] = useState({});

  useEffect(() => {
    fetchMeetingStats();
  }, []);

  const fetchMeetingStats = async () => {
    try {
      const response = await axios.get("/api/staff/meeting-stats");
      setMeetingStats(response.data);
    } catch (error) {
      console.error("Error fetching meeting stats", error);
    }
  };

  return (
    <section>
      <h2>Meeting Reports</h2>
      <p>Scheduled Meetings: {meetingStats.scheduledMeetings}</p>
      <p>Meeting Duration (Avg): {meetingStats.avgMeetingDuration} mins</p>
      <p>Meeting Record Requests: {meetingStats.recordRequests}</p>
    </section>
  );
};
