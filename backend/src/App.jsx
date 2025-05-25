import CourseList from "./main_page/courses/course_list";
import Calendar from "./main_page/calendar/calendar";
import Selected_Courses from "./main_page/selected_courses/selected_courses_list";
import React, { useState } from "react";

// fetch("http://localhost:3000/profile", {
//   credentials: "include",
// });

function App() {
  const [courses, setCourses] = useState([]);
  const [info, setInfo] = useState({}); // Initialize info state
  const [activeTab, setActiveTab] = useState("EXPLORE");

  console.log("🛠️ [App] Current courses state:", courses); // Log the courses state in App

  return (
    <>
      <Selected_Courses courses={courses} setCourses={setCourses} setActiveTab={setActiveTab} setInfo={setInfo}/>
      <CourseList courses={courses} setCourses={setCourses} info={info} setInfo={setInfo} activeTab={activeTab} setActiveTab={setActiveTab}/>
      <Calendar courses={courses} />
    </>
  );
}

export default App;