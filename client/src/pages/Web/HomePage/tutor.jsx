// import {
//     StudentList,
//     BlogList,
//     FileList,
//     ScheduleList
// } from "./section";

import { PostList } from "./sections/PostList";
import "./homepage.css";

export const TutorHomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <main className="homepage">
      <h2>Welcome, {user.name} ({user.role})</h2>

      <section>
        <h2>List Students</h2>
        {/* <StudentList /> */}
      </section>

      <section>
        <h2>List Posts</h2>
        <PostList />
      </section>

      <section>
        <h2>List File</h2>
        {/* <FileList /> */}
      </section>

      <section>
        <h2>List Schedule</h2>
        {/* <ScheduleList /> */}
      </section>
    </main>
  );
};

export default TutorHomePage;
