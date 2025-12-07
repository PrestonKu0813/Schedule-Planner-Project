import "./home_layout.css";
import { useSchedule } from "../../contexts/ScheduleContext.jsx";
import { useUser } from "../../contexts/UserContext";
import CourseList from "./components/courses/course_list";
import Calendar from "./components/calendar/calendar";
import Calendar_Key from "./components/calendar/calendar_key";
import Selected_Courses from "./components/selected_courses/selected_courses_list";
import SaveButton from "./components/save_button/save_button";
import React, { useState, useEffect } from "react";
import searchFilter from "./components/enums/search_filter.js";

export default function Home() {
  const {
    courses,
    setCourses,
    generatedCourses,
    setGeneratedCourses,
    info,
    setInfo,
    activeTab,
    setActiveTab,
    previewSection,
    setPreviewSection,
  } = useSchedule();

  const { user } = useUser();
  const { campus } = searchFilter;
  const { credit, coreCode, timeRanges, weekDays } = searchFilter;
  // const [courses, setCourses] = useState([]);
  // const [info, setInfo] = useState({}); // Initialize info state
  // const [activeTab, setActiveTab] = useState("EXPLORE");
  // const [previewSection, setPreviewSection] = useState(null); // Preview section for calendar hover
  // const [user, setUser] = useState(null);

  const [specialFilters, setSpecialFilters] = useState({
    campus: [
      campus.BU,
      campus.LI,
      campus.CA,
      campus.CD,
      campus.ASYNC,
      campus.ON,
    ],
    timeRanges: [timeRanges.MORNING, timeRanges.AFTERNOON, timeRanges.EVENING],
    day: [],
    credit: [
      credit.ONE,
      credit.TWO,
      credit.THREE,
      credit.FOUR,
      credit.CBA,
      credit.NA,
    ],
    coreCode: Object.keys(coreCode),
    weekDays: Object.keys(weekDays)
  });

  return (
    <div className="layout_container">
      <div className="selected_courses_container">
        <Selected_Courses
          courses={courses}
          setCourses={setCourses}
          setActiveTab={setActiveTab}
          setInfo={setInfo}
          setSpecialFilters={setSpecialFilters}
          specialFilters={specialFilters}
        />
      </div>
      <div className="course_list_container">
        <CourseList
          courses={courses}
          setCourses={setCourses}
          setGeneratedCourses={setGeneratedCourses}
          info={info}
          setInfo={setInfo}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setPreviewSection={setPreviewSection}
          specialFilters={specialFilters}
          setSpecialFilters={setSpecialFilters}
        />
      </div>
      <div className="calendar">
        <div className="calendar_container_full">
          <Calendar
            courses={generatedCourses}
            previewSection={previewSection}
          />
        </div>
        <div className="calendar_key_container_full">
          <Calendar_Key />
        </div>
      </div>
    </div>
  );
}
