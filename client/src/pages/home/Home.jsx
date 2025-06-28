import "./home_layout.css";
import CourseList from "./components/courses/course_list";
import Calendar from "./components/calendar/calendar";
import Calendar_Key from "./components/calendar/calendar_key";
import Selected_Courses from "./components/selected_courses/selected_courses_list";
import SaveButton from "./components/save_button/save_button";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [info, setInfo] = useState({}); // Initialize info state
  const [activeTab, setActiveTab] = useState("EXPLORE");
  const [previewSection, setPreviewSection] = useState(null); // Preview section for calendar hover

  console.log("🛠️ [App] Current courses state:", courses); // Log the courses state in App

  return (
    <div className="layout_container">
      <div className="selected_courses_container">
        <Selected_Courses
          courses={courses}
          setCourses={setCourses}
          setActiveTab={setActiveTab}
          setInfo={setInfo}
        />
      </div>
      <div className="course_list_container">
        <CourseList
          courses={courses}
          setCourses={setCourses}
          info={info}
          setInfo={setInfo}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setPreviewSection={setPreviewSection}
        />
      </div>
      <div className="calendar">
        <div className="save-button-area">
          <SaveButton />
        </div>
        <div className="calendar_container_full">
          <Calendar courses={courses} previewSection={previewSection} />
        </div>
        <div className="calendar_key_container_full">
          <Calendar_Key />
        </div>
      </div>
    </div>
  );
}
