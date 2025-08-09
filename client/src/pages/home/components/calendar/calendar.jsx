import React, { useState, useRef, useEffect } from "react";
import "./calendar.css";

import { 
  parseTimeString, 
  timeToMinutes, 
  calculatePosition, 
  dayToIndex, 
  isValidLecture, 
  isOnlineSection, 
  getOnlineSections, 
  createClassDetails,
  calculateLecturePosition
} from "./calendarUtils";
import ClassPopup from "./ClassPopup";

// Constants
const DAY_ABBREVIATIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOUR_LABELS = Array.from({ length: 16 }, (_, i) => i + 8);

// Helper: Render online section item
const renderOnlineSectionItem = ({ course, section }, index, handleClick, isSectionClosed) => {
  // Create unified class details for online section
  const classDetails = createClassDetails(course, section, null, null, null);
  const isClosed = isSectionClosed(section);
  
  return (
    <div 
      key={index} 
      className="online-section-item"
      onClick={(e) => handleClick(classDetails, e)}
      style={{ 
        cursor: 'pointer',
        ...(isClosed && {
          opacity: 0.6,
          filter: "grayscale(100%)",
          backgroundColor: "#f0f0f0"
        })
      }}
      title={isClosed ? `${course.course_name} - Section Closed` : course.course_name}
    >
      <p><strong>{course.course_name}</strong></p>
      {isClosed && <p style={{ color: '#dc3545', fontSize: '12px', margin: '2px 0' }}>CLOSED</p>}
    </div>
  );
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
  const [isOnlinePopupVisible, setIsOnlinePopupVisible] = useState(false);
  const [onlinePopupHeight, setOnlinePopupHeight] = useState(0);
  const calendarRef = useRef(null);
  const onlinePopupRef = useRef(null);

  // Debug: log courses prop whenever it changes
  useEffect(() => {
    console.log("🛠️ [Calendar] courses prop:", courses);
  }, [courses]);

  // Measure online popup height when it becomes visible
  useEffect(() => {
    if (isOnlinePopupVisible && onlinePopupRef.current) {
      const height = onlinePopupRef.current.offsetHeight;
      setOnlinePopupHeight(height);
    }
  }, [isOnlinePopupVisible]);

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

  const toggleOnlinePopup = () => {
    setIsOnlinePopupVisible(!isOnlinePopupVisible);
  };

  // Helper: Check if a section is closed
  const isSectionClosed = (section) => {
    return section.section_open !== undefined && section.section_open !== null && section.section_open === 0;
  };

  // Helper: Render a single lecture
  const renderLecture = (lecture, course, section, index, isPreview = false, hasConflict = false) => {
    const { topPos, heightPos, dayLeft, start, end } = calculateLecturePosition(lecture);
    const classDetails = createClassDetails(course, section, lecture, start, end);
    const isClosed = isSectionClosed(section);
    
    const className = isPreview 
      ? `calendar_class preview-class ${hasConflict ? 'conflict' : 'no-conflict'}`
      : `calendar_class ${isClosed ? 'closed-section' : ''}`;
    
    const style = {
      top: `${topPos}%`,
      left: `${dayLeft}%`,
      width: `${90 / 7}%`,
      height: `${heightPos}%`,
      backgroundColor: isClosed ? "#808080" : (campusColors[lecture.campus] || "#ccc"),
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
        title={isClosed ? `${course.course_name} - Section Closed` : course.course_name}
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
      <ClassPopup selectedClass={selectedClass} onClose={closePopup} />

      {/* Online Sections Popup at bottom */}
      {(() => {
        const onlineSections = getOnlineSections(courses);
        if (onlineSections.length === 0) return null;
        
        return (
          <>
            {/* Toggle Button */}
            <button 
              className={`online-popup-toggle ${isOnlinePopupVisible ? 'expanded' : 'collapsed'}`}
              onClick={toggleOnlinePopup}
              style={{
                bottom: isOnlinePopupVisible ? `${onlinePopupHeight}px` : '0'
              }}
            >
              {isOnlinePopupVisible ? '▼' : '▲'} Online Classes ({onlineSections.length})
            </button>
            
            {/* Collapsible Popup */}
            {isOnlinePopupVisible && (
              <div ref={onlinePopupRef} className="online-sections-popup">
                <div className="online-sections-list">
                  {onlineSections.map((item, index) => 
                    renderOnlineSectionItem(item, index, handleClassClick, isSectionClosed)
                  )}
                </div>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}

export default Calendar;