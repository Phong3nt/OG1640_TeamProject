import React, { useEffect, useState } from "react";
import axios from "axios";

export const ConversationReports = () => {
  const [conversationStats, setConversationStats] = useState({});

  useEffect(() => {
    fetchConversationStats();
  }, []);

  const fetchConversationStats = async () => {
    try {
      const response = await axios.get("/api/staff/conversation-stats");
      setConversationStats(response.data);
    } catch (error) {
      console.error("Error fetching conversation stats", error);
    }
  };

  return (
    <section>
      <h2>Conversation Reports</h2>
      <p>Total Conversations: {conversationStats.totalConversations}</p>
      <p>Total Messages: {conversationStats.totalMessages}</p>
      <p>Messages per User: {conversationStats.avgMessagesPerUser}</p>
    </section>
  );
};
