import React from "react";
import "./Search.css";

// Helper function to determine if a section is online
const isOnlineSection = (section) => {
  if (!section.lecture_info) return false;

  const lectureInfoArray = Object.values(section.lecture_info);
  return lectureInfoArray.every(
    (lecture) =>
      lecture.lectureDay === "Asynchronous content" ||
      lecture.lectureDay === "Hours by arrangement" ||
      lecture.lectureDay === "-1" ||
      lecture.campus === "Online" ||
      lecture.campus === -1
  );
};

// Helper function to determine if a section is open or closed
const getSectionStatus = (section) => {
  // You can modify this logic based on your data structure
  // For now, I'll use a simple example - you might want to check enrollment capacity
  if (section.section_open !== undefined && section.section_open !== null) {
    return section.section_open === 1 ? "open" : "closed";
  }
  // Default to open if no enrollment data is available
  return "open";
};

// Helper function to get meeting days from lecture_info
const getMeetingDays = (section) => {
  if (!section.lecture_info) return "N/A";

  const lectureInfoArray = Object.values(section.lecture_info);
  const days = new Set();

  lectureInfoArray.forEach((lecture) => {
    if (
      lecture.lectureDay &&
      lecture.lectureDay !== "-1" &&
      lecture.lectureDay !== "Asynchronous content" &&
      lecture.lectureDay !== "Hours by arrangement"
    ) {
      days.add(lecture.lectureDay);
    }
  });

  if (days.size === 0) {
    return isOnlineSection(section) ? "Online" : "N/A";
  }

  return Array.from(days).join(", ");
};

// Helper function to get campus information from lecture_info
const getCampus = (section) => {
  if (!section.lecture_info) return "N/A";

  const lectureInfoArray = Object.values(section.lecture_info);
  const campuses = new Set();

  lectureInfoArray.forEach((lecture) => {
    if (
      lecture.campus &&
      lecture.campus !== -1 &&
      lecture.campus !== "Online"
    ) {
      campuses.add(lecture.campus);
    } else if (lecture.campus === "Online" || lecture.campus === -1) {
      campuses.add("Online");
    }
  });

  if (campuses.size === 0) {
    return isOnlineSection(section) ? "Online" : "N/A";
  }

  return Array.from(campuses).join(", ");
};

// Helper function to get meeting times and locations with proper formatting
const getMeetingTimesAndLocations = (section) => {
  if (!section.lecture_info) return "N/A";

  const lectureInfoArray = Object.values(section.lecture_info);
  const meetings = [];

  lectureInfoArray.forEach((lecture) => {
    if (
      lecture.lectureDay &&
      lecture.lectureDay !== "-1" &&
      lecture.lectureDay !== "Asynchronous content" &&
      lecture.lectureDay !== "Hours by arrangement" &&
      lecture.lectureTime &&
      lecture.lectureTime !== "-1" &&
      lecture.lectureTime.includes(" - ")
    ) {
      const day = lecture.lectureDay;
      // Split the lectureTime string like the calendar does
      const [startTime, endTime] = lecture.lectureTime.split(" - ");
      const classroom = lecture.classroom || "TBA";
      const campus = lecture.campus || "";

      meetings.push({
        day,
        startTime: startTime?.trim() || "TBA",
        endTime: endTime?.trim() || "TBA",
        classroom,
        classroomLink: lecture.classroomLink,
        campus,
      });
    }
  });

  if (meetings.length === 0) {
    return isOnlineSection(section) ? "Online" : "TBA";
  }

  return meetings;
};

export const Section = ({
  section,
  selectedSections,
  setSelectedSections,
  setPreviewSection,
  courseInfo,
  isDimmed = false,
}) => {
  const isSelected = selectedSections.some(
    (selected) => selected.index_number === section.index_number
  );

  const sectionStatus = getSectionStatus(section);
  const rowClass = `section-table-row ${isDimmed ? "dimmed" : ""}`;

  const handleButtonClick = () => {
    if (isSelected) {
      setSelectedSections(
        selectedSections.filter(
          (selected) => selected.index_number !== section.index_number
        )
      );
    } else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  const handleMouseEnter = () => {
    // Create preview data with course info and section
    const previewData = {
      course: courseInfo,
      section: section,
      isConflict: false, // Will be determined by calendar
    };
    setPreviewSection(previewData);
  };

  const handleMouseLeave = () => {
    setPreviewSection(null);
  };

  return (
    <div
      className={rowClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleButtonClick}
      style={{ cursor: "pointer" }}
    >
      <div className="table-cell checkbox-cell">
        <button
          className={`section-button ${isSelected ? "selected" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick();
          }}
        ></button>
      </div>

      <div className="table-cell sec-cell">{section.section_number}</div>

      <div className="table-cell status-cell">
        <div className={`status-box ${sectionStatus}`}>
          {sectionStatus.toUpperCase()}
        </div>
      </div>

      <div className="table-cell index-cell">{section.index_number}</div>

      <div className="table-cell meeting-times-cell">
        <div className="meeting-times">
          {(() => {
            const meetings = getMeetingTimesAndLocations(section);
            if (typeof meetings === "string") {
              return <div className="meeting-line">{meetings}</div>;
            }
            return meetings.map((meeting, index) => (
              <div key={index} className="meeting-line">
                <span className="meeting-day">{meeting.day}</span>
                <br />
                <span className="meeting-time">
                  {meeting.startTime} - {meeting.endTime}
                </span>
              </div>
            ));
          })()}
        </div>
      </div>

      <div className="table-cell meeting-locations-cell">
        <div className="meeting-locations">
          {(() => {
            const meetings = getMeetingTimesAndLocations(section);
            if (typeof meetings === "string") {
              return (
                <div className="meeting-line">
                  {meetings === "Online" ? "Online" : "TBA"}
                </div>
              );
            }
            return meetings.map((meeting, index) => (
              <div key={index} className="meeting-line">
                {meeting.classroomLink ? (
                  <a
                    href={meeting.classroomLink}
                    target="_blank"
                    rel="noreferrer"
                    className="classroom-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {meeting.classroom}
                  </a>
                ) : (
                  <span className="classroom-text">{meeting.classroom}</span>
                )}
                {meeting.campus && (
                  <div className="campus-text">{meeting.campus}</div>
                )}
              </div>
            ));
          })()}
        </div>
      </div>

      <div className="table-cell instructor-cell">
        <div className="instructor-name">
          {section.instructor
            ? section.instructor.split(", ").map((name, index) => (
                <div key={index} className="instructor-name-part">
                  {name.trim()}
                </div>
              ))
            : "TBA"}
        </div>
      </div>
    </div>
  );
};
