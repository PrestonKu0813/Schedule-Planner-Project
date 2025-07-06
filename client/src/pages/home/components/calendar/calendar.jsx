import React, { useState, useRef, useEffect } from "react";
import "./calendar.css";
import "./classes.json";

// Constants
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_ABBREVIATIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOUR_LABELS = Array.from({ length: 16 }, (_, i) => i + 8);

// Helper: Parse time string to 24-hour format
const parseTimeString = (timeStr) => {
  if (!timeStr || timeStr === '-1') return null;
  const match = timeStr.match(/(\d+):(\d+) (AM|PM)/);
  if (!match) return null;
  const [_, hour, minute, period] = match;
  let hour24 = parseInt(hour, 10);
  if (period === "AM") {
    if (hour24 === 12) hour24 = 0; // 12 AM is 0
  } else {
    if (hour24 !== 12) hour24 += 12; // 12 PM is 12
  }
  return { hour: hour24, minute: parseInt(minute, 10) };
};

// Helper: Convert time string to minutes since midnight
const timeToMinutes = (timeStr) => {
  const parsed = parseTimeString(timeStr);
  if (!parsed) return 0;
  return parsed.hour * 60 + parsed.minute;
};

// Helper: Calculate vertical position (0% at 8:00 AM, 100% at 11:00 PM)
const calculatePosition = (time) => {
  const parsed = parseTimeString(time);
  if (!parsed) return 0;
  // Calendar starts at 8 AM, ends at 11 PM (16 hours = 960 minutes)
  const totalMinutes = (parsed.hour - 8) * 60 + parsed.minute;
  const clampedMinutes = Math.max(0, Math.min(960, totalMinutes));
  return (clampedMinutes / 960) * 100;
};

// Helper: Map day to index
const dayToIndex = (day) => DAYS.indexOf(day);

// Helper: Check if lecture should be displayed
const isValidLecture = (lecture) => {
  return lecture.lectureDay !== "Asynchronous content" &&
         lecture.lectureDay !== "-1" &&
         typeof lecture.lectureTime === "string" &&
         lecture.lectureTime !== "-1" &&
         lecture.lectureTime.includes(" - ");
};

// Helper: Calculate lecture positioning
const calculateLecturePosition = (lecture) => {
  const dayIndex = dayToIndex(lecture.lectureDay);
  const [start, end] = lecture.lectureTime.split(" - ");
  const topPos = calculatePosition(start);
  const bottomPos = calculatePosition(end);
  const heightPos = bottomPos - topPos;
  const dayLeft = 12 + dayIndex * (90 / 7);
  
  return {
    topPos,
    bottomPos,
    heightPos,
    dayLeft,
    start,
    end
  };
};

// Helper: Create class details object
const createClassDetails = (course, section, lecture, start, end) => ({
  title: course.course_name,
  day: lecture.lectureDay,
  start,
  end,
  core_code: course.core_code,
  course_number: course.course_number,
  instructor: section.instructor,
  section_number: section.section_number,
  campus: lecture.campus,
  lectureTime: lecture.lectureTime,
  classroom: lecture.classroom,
  classroomLink: lecture.classroomLink,
  recitation: lecture.recitation,
});

function Calendar({ courses, previewSection }) {
  // Color mapping for campus locations
  const campusColors = {
    Busch: "#ADD8E6",
    Livingston: "#FFA500",
    Online: "#F08080",
    "College Ave": "#FFFF99",
    "Cook/Doug": "#90EE90",
    Downtown: "#FFB6C1",
  };

  const [selectedClass, setSelectedClass] = useState(null);
  const calendarRef = useRef(null);

  // Debug: log courses prop whenever it changes
  useEffect(() => {
    console.log("🛠️ [Calendar] courses prop:", courses);
  }, [courses]);

  // Function to check for time conflicts
  const checkTimeConflict = (newLecture, existingLectures) => {
    const newStart = newLecture.lectureTime.split(" - ")[0];
    const newEnd = newLecture.lectureTime.split(" - ")[1];
    const newDay = newLecture.lectureDay;

    // Convert new lecture times to minutes
    const newStartMinutes = timeToMinutes(newStart);
    const newEndMinutes = timeToMinutes(newEnd);

    return existingLectures.some(existingLecture => {
      if (existingLecture.lectureDay !== newDay) return false;
      
      const existingStart = existingLecture.lectureTime.split(" - ")[0];
      const existingEnd = existingLecture.lectureTime.split(" - ")[1];
      
      // Convert existing lecture times to minutes
      const existingStartMinutes = timeToMinutes(existingStart);
      const existingEndMinutes = timeToMinutes(existingEnd);
      
      // Check for overlap using minute values
      return (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes);
    });
  };

  // Get all existing lectures from selected courses
  const getExistingLectures = () => {
    const lectures = [];
    (courses || []).forEach(course => {
      course.selected_sections.forEach(section => {
        const lectureInfoArray = Object.values(section.lecture_info);
        lectureInfoArray.forEach(lecture => {
          if (isValidLecture(lecture)) {
            lectures.push(lecture);
          }
        });
      });
    });
    return lectures;
  };

  // When a class is clicked, calculate popup coordinates relative to the calendar container.
  const handleClassClick = (cls, event) => {
    if (calendarRef.current) {
      const classRect = event.currentTarget.getBoundingClientRect();
      const containerRect = calendarRef.current.getBoundingClientRect();
      // Initial position: 5px to the right of the class box
      let popupX = classRect.right - containerRect.left + 5;

      // Position popup 5px below the class box by default
      let popupY = classRect.bottom - containerRect.top + 5;

      // Approximate popup dimensions (adjust to match your CSS)
      const POPUP_WIDTH = 250;
      const POPUP_HEIGHT = 200;

      // Clamp horizontal position within container
      if (popupX + POPUP_WIDTH > containerRect.width) {
        // Position to the left of the class block
        popupX = classRect.left - containerRect.left - POPUP_WIDTH - 5;
        if (popupX < 0) popupX = 0;
      }

      // If the popup would overflow the bottom of the container, flip it above the class block
      if (popupY + POPUP_HEIGHT > containerRect.height) {
        popupY = classRect.top - containerRect.top - POPUP_HEIGHT - 5;
        // Ensure it doesn't overflow above the top
        if (popupY < 0) popupY = 0;
      }

      setSelectedClass({ ...cls, popupX, popupY });
    }
  };

  const closePopup = () => {
    setSelectedClass(null);
  };

  // Helper: Render a single lecture
  const renderLecture = (lecture, course, section, index, isPreview = false, hasConflict = false) => {
    const { topPos, heightPos, dayLeft, start, end } = calculateLecturePosition(lecture);
    const classDetails = createClassDetails(course, section, lecture, start, end);
    
    const className = isPreview 
      ? `calendar_class preview-class ${hasConflict ? 'conflict' : 'no-conflict'}`
      : 'calendar_class';
    
    const style = {
      top: `${topPos}%`,
      left: `${dayLeft}%`,
      width: `${90 / 7}%`,
      height: `${heightPos}%`,
      backgroundColor: campusColors[lecture.campus] || "#ccc",
      ...(isPreview && {
        opacity: 0.7,
        zIndex: 1000,
      })
    };

    return (
      <div
        key={`${isPreview ? 'preview-' : ''}${course.course_code}-${section.index_number}-${index}`}
        className={className}
        style={style}
        onClick={isPreview ? undefined : (e) => handleClassClick(classDetails, e)}
      >
        {(!isPreview || !hasConflict) && course.course_name}
      </div>
    );
  };

  return (
    <div ref={calendarRef} className="calendar_container">
      {/* Header row: empty cell for time + day headers */}
      <div className="calendar_header_row">
        <div className="time_header_cell" />
        {DAY_ABBREVIATIONS.map((day) => (
          <div key={day} className="day_header_cell">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar body: hour lines, time labels, and class blocks */}
      <div className="calendar_body">
        {HOUR_LABELS.map((hourValue, i) => {
          const topPercent = (i / 15) * 100;
          const displayHour = hourValue % 12 || 12;
          const ampm = hourValue >= 12 ? "PM" : "AM";
          return (
            <div
              key={hourValue}
              className="hour_line"
              style={{ top: `${topPercent}%` }}
            >
              <div className="time_label">
                {displayHour} {ampm}
              </div>
            </div>
          );
        })}
        
        {/* Render existing selected courses */}
        {(courses || []).map((course) =>
          course.selected_sections.map((section) => {
            const lectureInfoArray = Object.values(section.lecture_info);
            return lectureInfoArray
              .filter(isValidLecture)
              .map((lecture, index) => 
                renderLecture(lecture, course, section, index)
              );
          })
        )}

        {/* Render preview section if hovering */}
        {previewSection && (() => {
          const existingLectures = getExistingLectures();
          const lectureInfoArray = Object.values(previewSection.section.lecture_info);
          
          return lectureInfoArray
            .filter(isValidLecture)
            .map((lecture, index) => {
              const hasConflict = checkTimeConflict(lecture, existingLectures);
              return renderLecture(lecture, previewSection.course, previewSection.section, index, true, hasConflict);
            });
        })()}
      </div>

      {/* Popup positioned relative to the calendar container */}
      {selectedClass && (
        <div
          className="popup"
          style={{ top: selectedClass.popupY, left: selectedClass.popupX }}
        >
          <button className="popup-close" onClick={closePopup}>
            &times;
          </button>
          <h2>{selectedClass.title}</h2>
          <p>
            <strong>Day:</strong> {selectedClass.day}
          </p>
          <p>
            <strong>Time:</strong> {selectedClass.start} - {selectedClass.end}
          </p>
          <p>
            <strong>Core Code:</strong> {selectedClass.core_code}
          </p>
          <p>
            <strong>Section:</strong> {selectedClass.section_number}
          </p>
          <p>
            <strong>Instructor:</strong> {selectedClass.instructor}
          </p>
          <p>
            <strong>Campus:</strong> {selectedClass.campus}
          </p>
          <p>
            <strong>Classroom:</strong>{" "}
            <a
              href={selectedClass.classroomLink}
              target="_blank"
              rel="noreferrer"
            >
              {selectedClass.classroom}
            </a>
          </p>
          {selectedClass.recitation ? (
            <p>
              <strong>Recitation:</strong> {selectedClass.recitation}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Calendar;
