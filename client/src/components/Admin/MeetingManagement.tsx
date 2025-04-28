import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spin, message } from "antd";
import "./MeetingManagement.css";

interface Meeting {
  _id: string;
  title: string;
  date: string;
  host: {
    fullName: string;
  };
  participants: {
    fullName: string;
  }[];
}

interface GroupedMeetings {
  date: string;
  count: number;
}

const StaffMeetingManagement: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [groupedMeetings, setGroupedMeetings] = useState<GroupedMeetings[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }
  
        const res = await axios.get("http://localhost:5000/api/meetings", {
          headers: {
            Authorization: token,
          },
        });
  
        const meetingsData = res.data.meetings || [];
        setMeetings(meetingsData);
  
        // Group meetings by date
        const grouped = groupMeetingsByDate(meetingsData);
        setGroupedMeetings(grouped);
      } catch (err: any) {
        console.error("Error fetching meetings:", err);
        if (err.response?.status === 404) {
          message.error("No meetings found.");
        } else if (err.response?.status === 401) {
          message.error("Unauthorized. Please log in again.");
          window.location.href = "/login";
        } else {
          message.error("Failed to fetch meetings.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchMeetings();
  }, []);

  // Group meetings by date
  const groupMeetingsByDate = (meetings: Meeting[]): GroupedMeetings[] => {
    const grouped = meetings.reduce((acc: Record<string, any>, meeting) => {
      const date = new Date(meeting.date).toLocaleDateString(); // Format date as "MM/DD/YYYY"
      if (!acc[date]) {
        acc[date] = {
          date,
          count: 0,
          titles: [],
          host: meeting.host?.fullName || "N/A",
          participants: [],
        };
      }
      acc[date].count += 1;
      acc[date].titles.push(meeting.title);
      acc[date].participants = [
        ...new Set([...acc[date].participants, ...meeting.participants.map((p) => p.fullName)]),
      ];
      return acc;
    }, {});
  
    return Object.values(grouped);
  };

  // Define table columns
const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Number of Meetings",
    dataIndex: "count",
    key: "count",
  },
  {
    title: "Meeting Titles",
    dataIndex: "titles",
    key: "titles",
    render: (titles: string[]) => titles.join(", "), // Hiển thị danh sách tiêu đề cuộc họp
  },
  {
    title: "Host",
    dataIndex: "host",
    key: "host",
    render: (host: string) => host || "N/A", // Hiển thị tên người tổ chức
  },
  {
    title: "Participants",
    dataIndex: "participants",
    key: "participants",
    render: (participants: string[]) => participants.join(", "), // Hiển thị danh sách người tham gia
  },
];

  return (
    <div className="staff-meeting-management-container">
      <h1 className="staff-meeting-management-title">Staff Meeting Management</h1>
      {loading ? (
        <Spin size="large" className="staff-meeting-management-spinner" />
      ) : (
        <Table
          className="staff-meeting-management-table"
          dataSource={groupedMeetings}
          columns={columns}
          rowKey="date"
          bordered
        />
      )}
    </div>
  );
};

export default StaffMeetingManagement;