import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import "./ScheduleNavigator.css";

/**
 * ScheduleNavigator
 * Component to display and navigate through generated schedules
 *
 * This component works STRICTLY with generated schedules and displays them
 * independently from user's manually selected courses. It creates a separate
 * "generated schedule view" state for the calendar.
 *
 * Props:
 * - schedules: Array of generated schedules (Array<Array<sectionObject>>)
 * - courses: Array of original course objects (used only for course metadata lookup)
 * - setCourses: Function to update the courses state (to display on calendar)
 * - onScheduleSelect: Optional callback when a schedule is selected
 */
const ScheduleNavigator = ({
  schedules = [],
  courses = [],
  setGeneratedCourses,
  selectedIndex,
  onSelectedIndexChange,
  onScheduleSelect,
}) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const lastAppliedRef = useRef({ index: null, length: null });

  // Early check: don't do anything if there are no schedules
  // This prevents any state updates when component first mounts with empty schedules
  const hasValidSchedules =
    schedules &&
    schedules.length > 0 &&
    schedules[0] &&
    Array.isArray(schedules[0]) &&
    schedules[0].length > 0;

  const isControlled = typeof selectedIndex === "number";

  const clampIndex = (index) => {
    if (!hasValidSchedules) return 0;
    const maxIndex = schedules.length - 1;
    if (maxIndex < 0) return 0;
    return Math.min(Math.max(index, 0), maxIndex);
  };

  const currentIndex = hasValidSchedules
    ? clampIndex(isControlled ? selectedIndex : internalIndex)
    : 0;

  /**
   * Convert a generated schedule (array of sections) to course format for calendar.
   * This builds courses STRICTLY from the generated schedule sections,
   * grouping sections by course_number and looking up course metadata.
   */
  const convertScheduleToCourses = (schedule) => {
    if (!schedule || schedule.length === 0) {
      return [];
    }

    console.log("🛠️ [ScheduleNavigator] Converting schedule to courses", {
      scheduleLength: schedule.length,
      availableCoursesCount: courses?.length || 0,
      availableCourses: courses?.map((c) => ({
        number: c.course_number,
        name: c.course_name,
        sectionsCount: c.selected_sections?.length || 0,
      })),
    });

    // Create lookup maps for faster access
    // Map: course_number -> course object
    const courseByNumberMap = new Map();
    // Map: index_number -> course object
    const courseByIndexMap = new Map();

    if (courses && courses.length > 0) {
      courses.forEach((course) => {
        if (course.course_number) {
          courseByNumberMap.set(course.course_number, course);
        }
        // Map each section's index_number to its parent course
        if (course.selected_sections) {
          course.selected_sections.forEach((section) => {
            if (section.index_number) {
              courseByIndexMap.set(section.index_number, course);
            }
          });
        }
      });
    }

    // Create a map to store course_number -> course info
    // Sections in the schedule should have course_number, or we need to look it up
    const courseMap = new Map();

    // Process each section in the generated schedule
    schedule.forEach((section) => {
      // Priority 1: Use metadata stored directly on section (most reliable)
      let courseNumber = section.course_number;
      let courseMetadata = section._course_metadata;

      // Priority 2: Look up from courses prop if metadata not on section
      if (!courseMetadata) {
        // Ensure we have course_number from section
        if (!courseNumber) {
          courseNumber = section.course_number;
        }

        // Use the lookup maps for fast access
        let originalCourse = null;

        if (courseNumber) {
          // Try to find by course_number first using the map
          originalCourse = courseByNumberMap.get(courseNumber);
        }

        // If not found or no course_number, find by matching index_number using the map
        if (!originalCourse && section.index_number) {
          originalCourse = courseByIndexMap.get(section.index_number);

          // Update courseNumber from the found course
          if (originalCourse) {
            courseNumber = originalCourse.course_number;
            courseMetadata = {
              course_number: originalCourse.course_number,
              course_name: originalCourse.course_name,
              credit: originalCourse.credit,
              core_code: originalCourse.core_code,
              subject_code: originalCourse.subject_code,
              course_link: originalCourse.course_link,
            };
          }
        }

        // If still not found, try lookup by course_number again
        if (!courseMetadata && courseNumber) {
          const foundCourse = courseByNumberMap.get(courseNumber);
          if (foundCourse) {
            courseMetadata = {
              course_number: foundCourse.course_number,
              course_name: foundCourse.course_name,
              credit: foundCourse.credit,
              core_code: foundCourse.core_code,
              subject_code: foundCourse.subject_code,
              course_link: foundCourse.course_link,
            };
          }
        }
      } else {
        // Use the stored metadata and ensure course_number is set
        courseNumber = courseMetadata.course_number || courseNumber;
      }

      // Final fallback if we still don't have course_number
      if (!courseNumber) {
        console.warn(
          "🛠️ [ScheduleNavigator] Section missing course_number:",
          section
        );
        return; // Skip sections without course_number
      }

      // Get or create course entry
      if (!courseMap.has(courseNumber)) {
        if (courseMetadata) {
          // Use stored metadata
          courseMap.set(courseNumber, {
            course_number: courseMetadata.course_number,
            course_name: courseMetadata.course_name,
            credit: courseMetadata.credit,
            core_code: courseMetadata.core_code,
            subject_code: courseMetadata.subject_code,
            course_link: courseMetadata.course_link,
            selected_sections: [], // Will be populated with schedule sections
          });
        } else {
          // Last resort fallback - should rarely happen now
          console.warn(
            `🛠️ [ScheduleNavigator] Could not find course metadata for ${courseNumber}, using fallback`,
            {
              availableCourses: courses?.map((c) => ({
                number: c.course_number,
                name: c.course_name,
              })),
              sectionIndex: section.index_number,
              hasCourseMetadata: !!section._course_metadata,
            }
          );
          courseMap.set(courseNumber, {
            course_number: courseNumber,
            course_name: `Course ${courseNumber}`, // Fallback
            credit: null,
            core_code: null,
            selected_sections: [],
          });
        }
      }

      // Add this section to the course's selected_sections (remove _course_metadata before adding)
      const course = courseMap.get(courseNumber);
      const { _course_metadata, ...sectionWithoutMetadata } = section;
      course.selected_sections.push(sectionWithoutMetadata);
    });

    // Convert map to array
    const convertedCourses = Array.from(courseMap.values());

    console.log("🛠️ [ScheduleNavigator] Converted schedule to courses:", {
      scheduleSectionsCount: schedule.length,
      coursesCount: convertedCourses.length,
      courses: convertedCourses.map((c) => ({
        name: c.course_name,
        number: c.course_number,
        sectionsCount: c.selected_sections.length,
      })),
    });

    return convertedCourses;
  };

  const applySchedule = useCallback(
    (schedule, index) => {
    console.log("🛠️ [ScheduleNavigator] applySchedule called", {
      scheduleLength: schedule?.length,
      requestedIndex: index,
      totalSchedules: schedules?.length || 0,
    });

    if (!schedule || schedule.length === 0 || !Array.isArray(schedule)) {
      console.warn("🛠️ [ScheduleNavigator] Blocked: Invalid schedule");
      return;
    }

      if (!setGeneratedCourses || typeof setGeneratedCourses !== "function") {
        console.warn(
          "🛠️ [ScheduleNavigator] Blocked: No setGeneratedCourses function"
        );
        return;
      }

      const coursesToDisplay = convertScheduleToCourses(schedule);
      console.log("🛠️ [ScheduleNavigator] Courses to display:", {
        originalCoursesCount: courses?.length || 0,
        displayCoursesCount: coursesToDisplay.length,
        displayCourses: coursesToDisplay.map((c) => ({
          name: c.course_name,
          number: c.course_number,
          sectionsCount: c.selected_sections?.length || 0,
        })),
      });

      if (coursesToDisplay.length > 0) {
        setGeneratedCourses(coursesToDisplay);
      } else {
        console.warn(
          "🛠️ [ScheduleNavigator] No courses to display from schedule"
        );
      }

      if (onScheduleSelect) {
        onScheduleSelect(schedule, index);
      }
    },
    [convertScheduleToCourses, courses, onScheduleSelect, setGeneratedCourses]
  );

  useEffect(() => {
    if (!hasValidSchedules) {
      lastAppliedRef.current = { index: null, length: null };
      if (!isControlled) {
        setInternalIndex(0);
      }
      return;
    }

    if (isControlled) {
      const clamped = clampIndex(selectedIndex);
      if (selectedIndex !== clamped && onSelectedIndexChange) {
        onSelectedIndexChange(clamped);
      }
    } else {
      setInternalIndex((prev) => clampIndex(prev));
    }
  }, [
    hasValidSchedules,
    schedules.length,
    isControlled,
    selectedIndex,
    onSelectedIndexChange,
  ]);

  useEffect(() => {
    if (!hasValidSchedules) return;
    const schedule = schedules[currentIndex];
    if (!schedule) return;
    const last = lastAppliedRef.current;
    if (last.index === currentIndex && last.length === schedules.length) {
      return;
    }
    applySchedule(schedule, currentIndex);
    lastAppliedRef.current = { index: currentIndex, length: schedules.length };
  }, [hasValidSchedules, currentIndex, schedules, applySchedule]);

  // If no schedules, don't render anything AND don't interfere with courses
  if (!hasValidSchedules) {
    return null;
  }

  const currentSchedule = schedules[currentIndex];
  const totalSchedules = schedules.length;

  // Navigate to previous schedule
  const handlePrevious = () => {
    if (currentIndex <= 0) return;
    const newIndex = currentIndex - 1;
    if (!isControlled) {
      setInternalIndex(newIndex);
    }
    if (onSelectedIndexChange) {
      onSelectedIndexChange(newIndex);
    }
  };

  // Navigate to next schedule
  const handleNext = () => {
    if (currentIndex >= totalSchedules - 1) return;
    const newIndex = currentIndex + 1;
    if (!isControlled) {
      setInternalIndex(newIndex);
    }
    if (onSelectedIndexChange) {
      onSelectedIndexChange(newIndex);
    }
  };

  // Extract index numbers from current schedule
  const indexNumbers = currentSchedule
    .map((section) => section.index_number)
    .filter((index) => index !== undefined && index !== null);

  return (
    <div className="schedule-navigator">
      <div className="schedule-navigator__header">
        <h3>Found Schedules</h3>
        <div className="schedule-navigator__counter">
          Schedule {currentIndex + 1} of {totalSchedules}
        </div>
      </div>

      <div className="schedule-navigator__content">
        <button
          className="schedule-navigator__arrow schedule-navigator__arrow--left"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          aria-label="Previous schedule"
        >
          &#8249;
        </button>

        <div className="schedule-navigator__schedule-info">
          <div className="schedule-navigator__index-list">
            <strong>Section Index Numbers:</strong>
            <div className="schedule-navigator__indices">
              {indexNumbers.length > 0 ? (
                indexNumbers.map((index, idx) => (
                  <span key={idx} className="schedule-navigator__index">
                    {index}
                  </span>
                ))
              ) : (
                <span className="schedule-navigator__no-indices">
                  No index numbers available
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          className="schedule-navigator__arrow schedule-navigator__arrow--right"
          onClick={handleNext}
          disabled={currentIndex === totalSchedules - 1}
          aria-label="Next schedule"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

ScheduleNavigator.propTypes = {
  schedules: PropTypes.array,
  courses: PropTypes.array,
  setGeneratedCourses: PropTypes.func,
  selectedIndex: PropTypes.number,
  onSelectedIndexChange: PropTypes.func,
  onScheduleSelect: PropTypes.func,
};

export default ScheduleNavigator;
