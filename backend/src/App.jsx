import CourseList from "./main_page/courses/course_list";
import Calendar from "./main_page/calendar/calendar";
import Selected_Courses from "./main_page/selected_courses/selected_courses_list";
import React, { useState } from "react";

const testCourses = [
  {
    name: "Introduction to Computer Science",
    credits: 3,
    instructor: "Dr. Smith",
  },
  {
    name: "Calculus II",
    credits: 4,
    instructor: "Dr. Johnson",
  },
];

function App() {
  const [courses, setCourses] = useState([]);

  return (
    <>
      <Selected_Courses courses={courses} setCourses={setCourses}/>
      <CourseList courses={courses} setCourses={setCourses} />
      <Calendar />
    </>
  );
}

export default App;
