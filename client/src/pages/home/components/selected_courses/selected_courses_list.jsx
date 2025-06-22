import React, { useState, useEffect } from "react";
import "./selected_courses.css";

function Selected_Courses({ courses, setCourses, setActiveTab, setInfo }) {
  const [isMinimized, setIsMinimized] = useState(false);
  // New state to control when the content is actually rendered/visible
  const [showContent, setShowContent] = useState(true);

  // Effect to manage content visibility based on minimization state
  useEffect(() => {
    if (isMinimized) {
      // If minimizing, hide content immediately for a cleaner collapse
      setShowContent(false);
    } else {
      // If expanding, wait for the CSS transition to finish (0.3s)
      // before making the content visible again.
      const animationDuration = 300; // Matches the '0.3s' transition in your CSS
      const timer = setTimeout(() => {
        setShowContent(true);
      }, animationDuration);

      // Cleanup the timer if the component unmounts or isMinimized changes again
      return () => clearTimeout(timer);
    }
  }, [isMinimized]); // This effect runs whenever isMinimized changes

  const handleRemoveCourse = (courseNumber) => {
    setCourses(courses.filter(course => course.course_number !== courseNumber));
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`selected_courses ${isMinimized ? "minimized" : ""}`}>
      {/* Minimize Button - positioned at the top right */}
      <button className="minimize_button" onClick={toggleMinimize}>
        {isMinimized ? ">" : "<"} {/* Right arrow when minimized, left arrow when expanded */}
      </button>

      {/* Content only renders if not minimized AND showContent is true */}
      {!isMinimized && showContent && (
        <div className="content_box">
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
                    className="set-info-button"
                    onClick={e => {
                      e.stopPropagation();
                      setInfo(course);
                      setActiveTab("COURSES");
                    }}
                  >
                    Details
                  </button>
                  <button
                    className="remove_course_button"
                    onClick={() => handleRemoveCourse(course.course_number)}>Remove Course
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Selected_Courses;