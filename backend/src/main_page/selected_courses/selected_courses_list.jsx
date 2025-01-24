import React, { useState, useEffect } from "react";
import "./selected_courses.css";


function Selected_Courses({ selectedCoursesData }) {
  const [courses, setCourses] = useState([]);

  // Update the local state whenever new data is received
  useEffect(() => {
    if (selectedCoursesData) {
      setCourses(selectedCoursesData);
    }
  }, [selectedCoursesData]);

  return (
    <div className="selected_courses">
      <h1 className="selected_courses_text">Selected Courses</h1>
      {courses.length === 0 ? (
        <p className="no_courses_selected_text">No courses selected yet!</p>
      ) : (
        <ul className="courses_list">
          {courses.map((course, index) => (
            <li key={index} className="course_card">
              <h2>{course.name}</h2>
              <p>Credits: {course.credits}</p>
              <p>Instructor: {course.instructor}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Selected_Courses;