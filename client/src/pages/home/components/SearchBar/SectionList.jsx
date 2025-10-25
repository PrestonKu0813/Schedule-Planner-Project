import React from "react";
import "./search.css";
import { Section } from "./Section";

export const SectionList = ({
  sections,
  selectedSections,
  setSelectedSections,
  setPreviewSection,
  courseInfo,
  specialFilters,
}) => {
  function mergeAdjacentRanges(ranges) {
    if (!Array.isArray(ranges) || ranges.length === 0) return [];

    // Sort ranges by start time
    const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
    const merged = [];

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      if (merged.length === 0) {
        merged.push([...current]);
      } else {
        const last = merged[merged.length - 1];
        // If last end time is exactly 1 less than current start time, merge
        if (last[1] === current[0] - 1) {
          last[1] = current[1];
        } else {
          merged.push([...current]);
        }
      }
    }
    return merged;
  }

  function getMilitaryHours(rangeStr) {
    // Helper to convert "9:00 AM" or "12:00 PM" to military hour (integer)
    function parseHour(timeStr) {
      const [hour, minute] = timeStr.split(":");
      let h = parseInt(hour, 10);
      const period = timeStr.includes("PM") ? "PM" : "AM";
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return h;
    }

    // Split range string
    console.log("Parsing time range:", rangeStr);
    if (typeof rangeStr !== "string") {
      console.log("Invalid rangeStr, not a string:", rangeStr);
      return [-1, -1];
    }
    const [startStr, endStr] = rangeStr.split(" - ").map((s) => s.trim());
    const startHour = parseHour(startStr);
    const endHour = parseHour(endStr);

    // Return array of hours (military time) within the range
    const hours = [startHour, endHour];
    return hours;
  }

  const mergedTimeRanges = mergeAdjacentRanges(specialFilters.timeRanges);

  // Filter sections based on campus and time after helper functions

  const filteredSections = sections.filter((section) => {
    const campusList = Object.values(section.lecture_info)
      .map((infoObj) => infoObj.campus)
      .filter(Boolean);

    // Campus filter
    const campusValid = !(
      campusList.some((campus) => !specialFilters.campus.includes(campus)) ||
      (specialFilters.campus.length > 0 &&
        !campusList.some((campus) => specialFilters.campus.includes(campus)))
    );

    // Weekday filter: every weekday in every info must be in specialFilters.weekDays
    const weekDaysValid = Object.values(section.lecture_info).every(
      (infoObj) => {
        if (infoObj.lectureDay === "Asynchronous content") return true; // Ignore invalid days
        return specialFilters.weekDays.includes(infoObj.lectureDay);
      }
    );

    // Time filter
    if (mergedTimeRanges.length > 0) {
      const timeValid = Object.values(section.lecture_info).every((infoObj) => {
        if (!infoObj.lectureTime) return false;
        const [startHour, endHour] = getMilitaryHours(infoObj.lectureTime);
        if (startHour === -1 && endHour === -1) return true;
        return mergedTimeRanges.some(
          ([rangeStart, rangeEnd]) =>
            startHour >= rangeStart && endHour <= rangeEnd
        );
      });
      console.log(
        "Time valid for section",
        section.section_number,
        ":",
        timeValid
      );
      console.log(
        "Campus valid for section",
        section.section_number,
        ":",
        campusValid
      );
      console.log(
        "WeekDays valid for section",
        section.section_number,
        ":",
        weekDaysValid
      );
      return campusValid && timeValid && weekDaysValid;
    } else {
      // Only include sections where ALL lecture_info ranges are [-1, -1]
      const onlyInvalidTime = Object.values(section.lecture_info).every(
        (infoObj) => {
          const [startHour, endHour] = getMilitaryHours(infoObj.lectureTime);
          return startHour === -1 && endHour === -1;
        }
      );
      console.log(
        "WeekDays valid for section",
        section.section_number,
        ":",
        weekDaysValid
      );
      return campusValid && onlyInvalidTime && weekDaysValid;
    }
  });

  return (
    <div className="section-list">
      {filteredSections.length === 0 ? (
        <div className="no-sections">
          No sections available for this course with current filter options.
        </div>
      ) : (
        <>
          <div className="section-table-header">
            <div className="table-cell checkbox-cell"></div>
            <div className="table-cell sec-cell">SEC</div>
            <div className="table-cell status-cell">STATUS</div>
            <div className="table-cell index-cell">INDEX</div>
            <div className="table-cell meeting-times-cell">MEETING TIMES</div>
            <div className="table-cell meeting-locations-cell">LOCATIONS</div>
            <div className="table-cell instructor-cell">INSTRUCTOR</div>
          </div>
          {filteredSections.map((section, id) => (
            <Section
              section={section}
              key={id}
              selectedSections={selectedSections}
              setSelectedSections={setSelectedSections}
              setPreviewSection={setPreviewSection}
              courseInfo={courseInfo}
            />
          ))}
        </>
      )}
    </div>
  );
};
