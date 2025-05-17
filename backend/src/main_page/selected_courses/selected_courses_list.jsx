import React, { useState, useEffect } from "react";
import "./selected_courses.css";

function Selected_Courses({ courses, setCourses }) {

  // Update the local state whenever new data is received
  // useEffect(() => {
  //   if (selectedCoursesData) {
  //     setCourses(selectedCoursesData);
  //   }
  // }, [selectedCoursesData]);

  const handleRemoveCourse = (courseNumber) => {
    setCourses(courses.filter(course => course.course_number !== courseNumber));
  };

  return (
    <div className="selected_courses">
      <h1 className="selected_courses_text">Selected Courses</h1>
      {courses.length === 0 ? (
        <p className="no_courses_selected_text">No courses selected yet!</p>
      ) : (
        <ul className="courses_list">
          {courses.map((course, index) => (
            <li key={index} className="course_card">
              <h2>{course.course_name}</h2>
              <p>Course Number: {course.course_number}</p>
              <p>Credits: {course.credit}</p>
              <p>Selected Sections: {course.selected_sections && course.selected_sections.length > 0 
                ? course.selected_sections.map(section => section.section_number).join(", ") 
                : "None"}
              </p>
              <button 
                className="remove_course_button"
                onClick={() => handleRemoveCourse(course.course_number)}>Remove Course
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Selected_Courses;