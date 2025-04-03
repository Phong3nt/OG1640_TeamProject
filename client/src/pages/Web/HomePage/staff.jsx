import { UserList } from "./sections/UserList/UserList";
import { PostCommentManagement } from "./sections/PostList/PostManagement";
import { MeetingReports } from "./sections/ScheduleList/MeetingReport";
import { ConversationReports } from "./sections/Conversation/ConversationReports";
import { GeneralReports } from "./sections/GeneralReports/GeneralReports";

export const StaffDashboard = () => {
  return (
    <main className="staff-dashboard">
      <h1>Staff Management Dashboard</h1>
      <UserList /> {/* Mặc định không truyền role => lấy toàn bộ user */}
      
      <PostCommentManagement />
      <MeetingReports />
      <ConversationReports />
      <GeneralReports />
    </main>
  );
};

export default StaffDashboard;
