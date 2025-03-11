// import {
//     StudentList,
//     BlogList,
//     FileList,
//     ScheduleList
// } from "./section";

import { PostList } from "./sections/PostList";

import "./homepage.css";

export const HomePage = () => {
  return (
    <main className="homepage">
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

export default HomePage;
