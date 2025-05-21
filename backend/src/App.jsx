import CourseList from "./main_page/courses/course_list";
import Calendar from "./main_page/calendar/calendar";
import Selected_Courses from "./main_page/selected_courses/selected_courses_list";
import React, { useState } from "react";


function App() {
  const [courses, setCourses] = useState([]);

  console.log("🛠️ [App] Current courses state:", courses); // Log the courses state in App

  return (
    <>
      <Selected_Courses courses={courses} setCourses={setCourses}/>
      <CourseList courses={courses} setCourses={setCourses} />
      <Calendar courses={courses} />
    </>
  );
}

export default App;