import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MeetingRoom from './components/MeetingRoom';

const MeetingPage = () => {
  const { meetingId } = useParams(); // Get the meeting ID from the URL
  const [meeting, setMeeting] = useState(null);

  useEffect(() => {
    // Fetch meeting details from the backend
    const fetchMeeting = async () => {
      try {
        const response = await fetch(`/api/meetings/${meetingId}`);
        const data = await response.json();
        console.log("API Response:", data); // Debugging
        setMeeting(data.meeting);
      } catch (error) {
        console.error('Error fetching meeting details:', error);
      }
    };

    fetchMeeting();
  }, [meetingId]);

  if (!meeting) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{meeting.title}</h1>
      <p>{meeting.description}</p>
      <MeetingRoom meetingRoom={meeting.meetingRoom} userName="John Doe" />
    </div>
  );
};

export default MeetingPage;