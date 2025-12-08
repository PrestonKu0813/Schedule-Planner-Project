import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./Search.css";
import { SectionList } from "./SectionList";

/**
 *
 * @param {*} props
 * @param {Object} props.result - The course result object containing course details.
 * @param {Array} props.courses - Array of currently selected courses.
 * @param {Function} props.setCourses - Function to update the selected courses.
 * @param {Function} props.setInfo - Function to set the course info for details view.
 * @param {Function} props.setActiveTab - Function to set the active tab in the UI.
 * @param {Function} props.setPreviewSection - Function to set the preview section for details view.
 * @description Component to display a single search result with options to view details, add/remove course, and select sections.
 * @returns
 */

export const SearchResult = ({
  result,
  courses,
  setCourses,
  setPreviewSection,
  specialFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState(
    result.selected_sections || []
  ); // Initialize from result
  const isCourseInList = courses.some(
    (course) => course.course_number === result.course_number
  );
  const [isCourseAdded, setIsCourseAdded] = useState(isCourseInList);
  const [isAllSectionsSelected, setIsAllSectionsSelected] = useState(true); // Track toggle state
  const [manualOverrides, setManualOverrides] = useState(new Set());
  const dropdownRef = useRef(null);

  // Debug: log renders and selectedSections updates
  // Remove or guard behind a flag in production
  // eslint-disable-next-line no-console
  console.debug("[SearchResult] render", result.course_number, {
    selectedCount: selectedSections.length,
    selectedSections: selectedSections.map((s) => s.index_number),
  });

  const getFilteredSections = React.useCallback(() => {
    // This logic should be kept in sync with SectionList's filtering
    function mergeAdjacentRanges(ranges) {
      if (!Array.isArray(ranges) || ranges.length === 0) return [];
      const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
      const merged = [];
      for (let i = 0; i < sorted.length; i++) {
        const current = sorted[i];
        if (merged.length === 0) {
          merged.push([...current]);
        } else {
          const last = merged[merged.length - 1];
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
      function parseHour(timeStr) {
        const [hour, minute] = timeStr.split(":");
        let h = parseInt(hour, 10);
        const period = timeStr.includes("PM") ? "PM" : "AM";
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        return h;
      }
      if (typeof rangeStr !== "string") {
        return [-1, -1];
      }
      const [startStr, endStr] = rangeStr.split(" - ").map((s) => s.trim());
      const startHour = parseHour(startStr);
      const endHour = parseHour(endStr);
      return [startHour, endHour];
    }

    const mergedTimeRanges = mergeAdjacentRanges(specialFilters.timeRanges);

    return sections.filter((section) => {
      const campusList = Object.values(section.lecture_info)
        .map((infoObj) => infoObj.campus)
        .filter(Boolean);

      const campusValid = !(
        campusList.some((campus) => !specialFilters.campus.includes(campus)) ||
        (specialFilters.campus.length > 0 &&
          !campusList.some((campus) => specialFilters.campus.includes(campus)))
      );

      const weekDaysValid = Object.values(section.lecture_info).every(
        (infoObj) => {
          if (infoObj.lectureDay === "Asynchronous content") return true;
          return specialFilters.weekDays.includes(infoObj.lectureDay);
        }
      );

      if (mergedTimeRanges.length > 0) {
        const timeValid = Object.values(section.lecture_info).every(
          (infoObj) => {
            if (!infoObj.lectureTime) return false;
            const [startHour, endHour] = getMilitaryHours(infoObj.lectureTime);
            if (startHour === -1 && endHour === -1) return true;
            return mergedTimeRanges.some(
              ([rangeStart, rangeEnd]) =>
                startHour >= rangeStart && endHour <= rangeEnd
            );
          }
        );
        return campusValid && timeValid && weekDaysValid;
      } else {
        const onlyInvalidTime = Object.values(section.lecture_info).every(
          (infoObj) => {
            const [startHour, endHour] = getMilitaryHours(infoObj.lectureTime);
            return startHour === -1 && endHour === -1;
          }
        );
        return campusValid && onlyInvalidTime && weekDaysValid;
      }
    });
  }, [sections, specialFilters]);

  // toggles the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // adds or removes the course from the selected courses list
  const handleAddRemoveCourse = (e) => {
    e.stopPropagation();
    if (isCourseAdded) {
      // Remove course from selected courses
      setCourses(
        courses.filter(
          (course) => course.course_number !== result.course_number
        )
      );
    } else {
      // Add course to selected courses with selected_sections initialized
      const courseNameEncoded = encodeURIComponent(result.course_name);
      const courseLink = `https://classes.rutgers.edu/soc/#keyword?keyword=${courseNameEncoded}&semester=92025&campus=NB&level=U`;
      setCourses([
        ...courses,
        {
          ...result,
          selected_sections: selectedSections,
          course_link: courseLink,
        },
      ]);
    }
    setIsCourseAdded(!isCourseAdded);
  };

  // Toggles all sections: if all are selected, deselects them; otherwise, selects all
  const handleToggleAllSections = () => {
    if (isAllSectionsSelected) {
      // Untoggle: Deselect all sections, regardless of filtering
      setSelectedSections([]);
    } else {
      // Toggle: Add all filtered sections that are not already selected
      const filteredSections = getFilteredSections();
      const sectionsToAdd = filteredSections.filter(
        (fs) =>
          !selectedSections.some((ss) => ss.index_number === fs.index_number)
      );
      setSelectedSections([...selectedSections, ...sectionsToAdd]);
    }
    // The state of "isAllSectionsSelected" will be re-evaluated by its useEffect
  };

  useEffect(() => {
    setIsCourseAdded(
      courses.some((course) => course.course_number === result.course_number)
    );
  }, [courses, result.course_number]);

  useEffect(() => {
    const sectionList = result.sections ? Object.values(result.sections) : [];
    setSections(sectionList);
    if (!isCourseAdded) {
      setSelectedSections(sectionList); // No sections selected by default when course is not added
    } else {
      const matchedCourse = courses.find(
        (course) => course.course_number === result.course_number
      );
      if (!matchedCourse) return;
      // Set selected_sections to match, or empty array if not found
      // Avoid mutating the `result` prop directly — use state instead
      setSelectedSections(matchedCourse.selected_sections || []);
    }
    // Check if all sections are already selected
    setIsAllSectionsSelected(
      sectionList.length > 0 &&
        sectionList.every((section) =>
          selectedSections.some(
            (selected) => selected.index_number === section.index_number
          )
        )
    );
  }, [result.course_number, isCourseAdded]);

  useEffect(() => {
    // Check if all filtered sections are selected
    const filtered = getFilteredSections();
    setIsAllSectionsSelected(
      filtered.length > 0 &&
        filtered.every((section) =>
          selectedSections.some(
            (selected) => selected.index_number === section.index_number
          )
        )
    );
  }, [sections, selectedSections, getFilteredSections]);

  // Update result.selected_sections whenever selectedSections changes
  useEffect(() => {
    // Debug: log when selectedSections changes
    // eslint-disable-next-line no-console
    console.debug(
      "[SearchResult] selectedSections changed",
      result.course_number,
      {
        selectedCount: selectedSections.length,
        selectedIndexes: selectedSections.map((s) => s.index_number),
      }
    );
    // Force a layout reflow to help the browser repaint updated text in edge cases
    // (reading offsetHeight forces layout). This is lightweight and only runs
    // when selectedSections changes.
    if (dropdownRef.current) {
      // eslint-disable-next-line no-unused-expressions
      void dropdownRef.current.offsetHeight;
    }
  }, [selectedSections, result]);

  useEffect(() => {
    if (isCourseAdded) {
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.course_number === result.course_number
            ? { ...course, selected_sections: selectedSections }
            : course
        )
      );
    }
  }, [selectedSections, isCourseAdded, result.course_number]);

  return (
    <div className="search-result-container" ref={dropdownRef}>
      <div className="result-header" onClick={toggleDropdown}>
        <div className="result-title">{result.course_name}</div>
        <button
          className="visit-course-button"
          aria-label="Open course page in new tab"
          onClick={(e) => {
            e.stopPropagation();
            const courseNameEncoded = encodeURIComponent(result.course_name);
            const courseLink = `https://classes.rutgers.edu/soc/#keyword?keyword=${courseNameEncoded}&semester=92025&campus=NB&level=U`;
            window.open(courseLink, "_blank", "noopener,noreferrer");
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🌐
          </span>
        </button>
        <button
          onClick={handleAddRemoveCourse}
          className={
            isCourseAdded ? "remove-course-button" : "add-course-button"
          }
        >
          {isCourseAdded ? "-" : "+"}
        </button>
        <button
          type="button"
          className="toggle-open-button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse sections" : "Expand sections"}
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown();
          }}
        >
          {isOpen ? "▲" : "▼"}
        </button>
      </div>
      {isOpen && (
        <div className="dropdown">
          <p>Course Number: {result.course_number}</p>
          <p>Credits: {result.credit}</p>
          <p>Core Codes: {result.core_code}</p>
          <div className="selected-sections-display">
            <p key={selectedSections.map((s) => s.index_number).join(",")}>
              Selected Sections:{" "}
              {selectedSections
                .map((section) => section.section_number)
                .join(", ")}
            </p>
          </div>
          <button
            className={`toggle-all-sections-button ${isAllSectionsSelected ? "toggled" : ""}`}
            onClick={handleToggleAllSections}
          >
            {isAllSectionsSelected
              ? "Deselect All Sections"
              : "Select All Sections"}
          </button>
          <SectionList
            sections={sections}
            selectedSections={selectedSections}
            setSelectedSections={(newSections) => {
              const newSectionNumbers = new Set(
                Array.isArray(newSections)
                  ? newSections.map((s) => s.index_number)
                  : []
              );
              const oldSectionNumbers = new Set(
                selectedSections.map((s) => s.index_number)
              );

              const added = [...newSectionNumbers].filter(
                (x) => !oldSectionNumbers.has(x)
              );
              const removed = [...oldSectionNumbers].filter(
                (x) => !newSectionNumbers.has(x)
              );

              const newOverrides = new Set(manualOverrides);
              added.forEach((num) => newOverrides.add(num));
              removed.forEach((num) => newOverrides.delete(num));

              setManualOverrides(newOverrides);
              setSelectedSections(newSections);
            }}
            setPreviewSection={setPreviewSection}
            courseInfo={result}
            specialFilters={specialFilters}
            manualOverrides={manualOverrides}
          />
        </div>
      )}
    </div>
  );
};

SearchResult.propTypes = {
  result: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired,
  setCourses: PropTypes.func.isRequired,
  setPreviewSection: PropTypes.func,
  specialFilters: PropTypes.object,
};
