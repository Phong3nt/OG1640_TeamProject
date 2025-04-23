import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MeetingRoom = () => {
  const { meetingId } = useParams(); // Get the meeting ID from the URL
  const [meeting, setMeeting] = useState(null);

  useEffect(() => {
    // Fetch meeting details from the backend
    const fetchMeeting = async () => {
      try {
        const response = await fetch(`/api/meetings/${meetingId}`);
        const data = await response.json();
        if (data.success) {
          setMeeting(data.meeting);
        } else {
          console.error('Failed to fetch meeting details');
        }
      } catch (error) {
        console.error('Error fetching meeting:', error);
      }
    };

    fetchMeeting();
  }, [meetingId]);

  useEffect(() => {
    if (meeting) {
      const domain = 'meet.jit.si'; // Use your Jitsi server domain if self-hosted
      const options = {
        roomName: meeting.meetingRoom, // Use the meeting room from the backend
        width: '100%',
        height: 600,
        parentNode: document.getElementById('jitsi-container'),
        userInfo: {
          displayName: 'John Doe', // Replace with the logged-in user's name
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);

      // Example: Listen for events
      api.addEventListener('participantJoined', (event) => {
        console.log('Participant joined:', event);
      });

      api.addEventListener('readyToClose', () => {
        console.log('Meeting ended');
      });

      return () => api.dispose(); // Clean up when the component unmounts
    }
  }, [meeting]);

  if (!meeting) {
    return <div>Loading meeting...</div>;
  }

  return (
    <div>
      <h1>{meeting.title}</h1>
      <p>{meeting.description}</p>
      <div id="jitsi-container" style={{ width: '100%', height: '600px' }}></div>
    </div>
  );
};

export default MeetingRoom;