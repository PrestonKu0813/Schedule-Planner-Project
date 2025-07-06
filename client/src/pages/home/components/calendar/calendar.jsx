import React, { useState, useRef, useEffect } from "react";
import "./calendar.css";
import "./classes.json";

// Helper: Map day to index (Mon=0, Tue=1, …, Sun=6)
const dayToIndex = (day) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days.indexOf(day);
};

// Helper: Calculate vertical position (0% at 8:00 AM, 100% at 11:00 PM)
const calculatePosition = (time) => {
  if (!time || time === '-1') return 0; // Guard for invalid or online classes
  const match = time.match(/(\d+):(\d+) (AM|PM)/);
  if (!match) return 0; // Guard for malformed time strings
  const [_, hour, minute, period] = match;
  let hour24 = parseInt(hour, 10);
  if (period === "AM") {
    if (hour24 === 12) hour24 = 0; // 12 AM is 0
  } else {
    if (hour24 !== 12) hour24 += 12; // 12 PM is 12
  }
  // Calendar starts at 8 AM, ends at 11 PM (16 hours = 960 minutes)
  const totalMinutes = (hour24 - 8) * 60 + parseInt(minute, 10);
  const clampedMinutes = Math.max(0, Math.min(960, totalMinutes));
  return (clampedMinutes / 960) * 100;
};

// Array of hours from 8 AM (8) to 11 PM (23) -> 16 labels
const hourLabels = Array.from({ length: 16 }, (_, i) => i + 8);

// Helper: Convert time string to minutes since midnight
const timeToMinutes = (timeStr) => {
  if (!timeStr || timeStr === '-1') return 0;
  const match = timeStr.match(/(\d+):(\d+) (AM|PM)/);
  if (!match) return 0;
  const [_, hour, minute, period] = match;
  let hour24 = parseInt(hour, 10);
  if (period === "AM") {
    if (hour24 === 12) hour24 = 0; // 12 AM is 0
  } else {
    if (hour24 !== 12) hour24 += 12; // 12 PM is 12
  }
  return hour24 * 60 + parseInt(minute, 10);
};

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
          if (lecture.lectureDay !== "Asynchronous content" && 
              lecture.lectureDay !== "-1" && 
              typeof lecture.lectureTime === "string" &&
              lecture.lectureTime !== "-1" &&
              lecture.lectureTime.includes(" - ")) {
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

  return (
    <div ref={calendarRef} className="calendar_container">
      {/* Header row: empty cell for time + day headers */}
      <div className="calendar_header_row">
        <div className="time_header_cell" />
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="day_header_cell">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar body: hour lines, time labels, and class blocks */}
      <div className="calendar_body">
        {hourLabels.map((hourValue, i) => {
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
              .filter(
                (lecture) =>
                  lecture.lectureDay !== "Asynchronous content" &&
                  lecture.lectureDay !== "-1" &&
                  typeof lecture.lectureTime === "string" &&
                  lecture.lectureTime !== "-1" &&
                  lecture.lectureTime.includes(" - ")
              )
              .map((lecture, index) => {
                const dayIndex = dayToIndex(lecture.lectureDay);
                const [start, end] = lecture.lectureTime.split(" - ");
                const topPos = calculatePosition(start);
                const bottomPos = calculatePosition(end);
                const heightPos = bottomPos - topPos;
                const dayLeft = 12 + dayIndex * (90 / 7);

                const classDetails = {
                  title: course.course_name,
                  day: lecture.lectureDay,
                  start: start,
                  end: end,
                  core_code: course.core_code,
                  course_number: course.course_number,
                  instructor: section.instructor,
                  section_number: section.section_number,
                  campus: lecture.campus,
                  lectureTime: lecture.lectureTime,
                  classroom: lecture.classroom,
                  classroomLink: lecture.classroomLink,
                  recitation: lecture.recitation,
                };

                return (
                  <div
                    key={`${course.course_code}-${section.index_number}-${index}`}
                    className="calendar_class"
                    style={{
                      top: `${topPos}%`,
                      left: `${dayLeft}%`,
                      width: `${90 / 7}%`,
                      height: `${heightPos}%`,
                      backgroundColor: campusColors[lecture.campus] || "#ccc",
                    }}
                    onClick={(e) => handleClassClick(classDetails, e)}
                  >
                    {course.course_name}
                  </div>
                );
              });
          })
        )}

        {/* Render preview section if hovering */}
        {previewSection && (() => {
          const existingLectures = getExistingLectures();
          const lectureInfoArray = Object.values(previewSection.section.lecture_info);
          
          return lectureInfoArray
            .filter(
              (lecture) =>
                lecture.lectureDay !== "Asynchronous content" &&
                lecture.lectureDay !== "-1" &&
                typeof lecture.lectureTime === "string" &&
                lecture.lectureTime !== "-1" &&
                lecture.lectureTime.includes(" - ")
            )
            .map((lecture, index) => {
              const dayIndex = dayToIndex(lecture.lectureDay);
              const [start, end] = lecture.lectureTime.split(" - ");
              const topPos = calculatePosition(start);
              const bottomPos = calculatePosition(end);
              const heightPos = bottomPos - topPos;
              const dayLeft = 12 + dayIndex * (90 / 7);
              
              // Check for conflicts
              const hasConflict = checkTimeConflict(lecture, existingLectures);
              
              return (
                <div
                  key={`preview-${previewSection.section.index_number}-${index}`}
                  className={`calendar_class preview-class ${hasConflict ? 'conflict' : 'no-conflict'}`}
                  style={{
                    top: `${topPos}%`,
                    left: `${dayLeft}%`,
                    width: `${90 / 7}%`,
                    height: `${heightPos}%`,
                    backgroundColor: campusColors[lecture.campus] || "#ccc",
                    opacity: 0.7, // Slightly higher opacity for better visibility
                    zIndex: 1000, // Ensure preview appears on top
                  }}
                >
                  {!hasConflict && previewSection.course.course_name}
                </div>
              );
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
