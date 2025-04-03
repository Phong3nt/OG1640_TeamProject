import React, { useEffect, useState } from "react";
import axios from "axios";

export const GeneralReports = () => {
  const [generalStats, setGeneralStats] = useState({});

  useEffect(() => {
    fetchGeneralStats();
  }, []);

  const fetchGeneralStats = async () => {
    try {
      const response = await axios.get("/api/staff/general-stats");
      setGeneralStats(response.data);
    } catch (error) {
      console.error("Error fetching general stats", error);
    }
  };

  return (
    <section>
      <h2>Reports</h2>
      <p>Messages in last 7 days: {generalStats.messagesLast7Days}</p>
      <p>Avg messages per tutor: {generalStats.avgMessagesPerTutor}</p>
      <p>
        Students without a personal tutor: {generalStats.studentsWithoutTutor}
      </p>
      <p>
        Students with no interaction (7 days): {generalStats.noInteraction7Days}
      </p>
      <p>
        Students with no interaction (28 days):{" "}
        {generalStats.noInteraction28Days}
      </p>
    </section>
  );
};
