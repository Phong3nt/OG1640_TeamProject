import { PostList, FileList } from "../HomePage/sections";
import "./homepage.css";

export const StudentHomePage = () => {
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }
  if (!user) {
    // Có thể hiển thị thông báo lỗi hoặc redirect
    return (
      <main className="homepage">
        <h2>Error</h2>
        <p>Could not load user information. Please try logging in again.</p>
      </main>
    );
  }

  return (
    <main className="homepage">
      <h2>Welcome, {user.name} ({user.role})</h2>

      {/* <section className="tutor-section"> 
        <h2>Your Assigned Tutor</h2>
        <MyAssignedTutor currentUser={user} />
      </section> */}

      <section>
        <h2>List Posts</h2>
        <PostList />
      </section>

      <section>
        <h2>List File</h2>
        <FileList />
      </section>

      <section>
        <h2>List Schedule</h2>
        {/* <ScheduleList /> */}
      </section>
    </main>
  );
};

export default StudentHomePage;
