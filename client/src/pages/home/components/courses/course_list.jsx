import "./course_list.css";
import { useUser } from "../../../../contexts/UserContext";
import { useSchedule } from "../../../../contexts/ScheduleContext";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResultsList } from "../SearchBar/SearchResultsList";
import { SearchResult } from "../SearchBar/SearchResult";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { SearchAPI } from "../SearchBar/SearchAPI.js";
import LogoutButton from "../buttons/logout_button";
import SaveButton from "../save_button/save_button";
import SavedSchedules from "../saved_schedules/saved_schedules";
import Select from "react-select";
import searchFilter from "../enums/search_filter.js";
import RegisterButton from "../save_button/RegisterButton.jsx";
import ScheduleGenerator, {
  generateSchedulesFromCourses,
} from "../schedule_generator/schedule_generator.jsx";
import ScheduleNavigator from "../schedule_generator/ScheduleNavigator.jsx";
// Selected courses are rendered with SearchResult

const buildCoursesSignature = (courses) => {
  if (!courses || courses.length === 0) return "[]";

  return JSON.stringify(
    courses.map((course) => ({
      course_number: course.course_number || course.id || null,
      sections: (course.selected_sections || []).map(
        (section) =>
          section.index_number ||
          section.id ||
          section.section_number ||
          `${section.course_number || ""}-${section.section_id || ""}`
      ),
    }))
  );
};

const convertScheduleToCourses = (schedule) => {
  if (!schedule || schedule.length === 0) return [];

  const courseMap = new Map();

  schedule.forEach((section) => {
    const metadata = section._course_metadata || {};
    const courseNumber =
      metadata.course_number || section.course_number || section.course_id;
    if (!courseNumber) return;

    if (!courseMap.has(courseNumber)) {
      courseMap.set(courseNumber, {
        course_number: courseNumber,
        course_name: metadata.course_name || `Course ${courseNumber}`,
        credit: metadata.credit ?? null,
        core_code: metadata.core_code ?? null,
        subject_code: metadata.subject_code ?? null,
        course_link: metadata.course_link ?? null,
        selected_sections: [],
      });
    }

    const courseEntry = courseMap.get(courseNumber);
    const { _course_metadata, ...sectionWithoutMetadata } = section;
    courseEntry.selected_sections.push(sectionWithoutMetadata);
  });

  return Array.from(courseMap.values());
};

const getCoursesForScheduleIndex = (schedules, index = 0) => {
  if (!schedules || schedules.length === 0) return [];
  const safeIndex = Math.min(Math.max(index, 0), schedules.length - 1);
  return convertScheduleToCourses(schedules[safeIndex]);
};

/**
 * @param {*} props
 * @param {Array} props.courses - Array of course objects.
 * @param {Function} props.setCourses - Function to update the courses state.
 * @param {Object} props.info - Object containing information about the selected course.
 * @param {Function} props.setInfo - Function to update the info state.
 * @param {string} props.activeTab - Currently active tab, either "EXPLORE" or "COURSES".
 * @param {Function} props.setActiveTab - Function to set the active tab.
 * @param {Function} props.setPreviewSection - Function to set the preview section.
 * @description In charge of middle section of the home page, which contains the Explore and Courses tabs.
 * @returns
 */

function CourseList({
  courses,
  setCourses,
  setGeneratedCourses,
  info,
  setInfo,
  activeTab,
  setActiveTab,
  setPreviewSection,
  specialFilters,
  setSpecialFilters,
}) {
  const { user } = useUser();

  const [generatedSchedules, setGeneratedSchedules] = useState([]);
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(0);
  // Store original courses used to generate schedules - needed for metadata lookup
  const [originalCoursesForSchedules, setOriginalCoursesForSchedules] =
    useState([]);
  const coursesSignature = useMemo(
    () => buildCoursesSignature(courses),
    [courses]
  );
  const lastGeneratedSignatureRef = useRef(null);
  const coursesLength = courses ? courses.length : 0;
  const hasCourses = coursesLength > 0;

  const { campus } = searchFilter;
  const savedSchedulesRef = useRef(null);

  const generatedSchedulesCount = generatedSchedules.length;

  useEffect(() => {
    setSelectedScheduleIndex((prev) => {
      if (generatedSchedulesCount === 0) {
        return 0;
      }
      if (prev >= generatedSchedulesCount) {
        return 0;
      }
      return prev;
    });
  }, [generatedSchedulesCount]);

  const runGeneration = useCallback(
    (precomputedSchedules) => {
      let schedules;
      if (precomputedSchedules !== undefined) {
        schedules = precomputedSchedules;
      } else if (hasCourses) {
        schedules = generateSchedulesFromCourses(courses);
      } else {
        schedules = [];
      }

      const nextIndex = schedules.length > 0 ? 0 : 0;
      setGeneratedSchedules(schedules);
      setSelectedScheduleIndex(nextIndex);
      const coursesForCalendar = getCoursesForScheduleIndex(
        schedules,
        nextIndex
      );
      setGeneratedCourses(coursesForCalendar);

      if (schedules.length > 0) {
        setOriginalCoursesForSchedules([...courses]);
      } else {
        setOriginalCoursesForSchedules([]);
      }

      lastGeneratedSignatureRef.current = coursesSignature;
      return schedules;
    },
    [
      courses,
      coursesSignature,
      hasCourses,
      setGeneratedCourses,
      setGeneratedSchedules,
      setSelectedScheduleIndex,
      setOriginalCoursesForSchedules,
    ]
  );

  useEffect(() => {
    if (!hasCourses) {
      if (lastGeneratedSignatureRef.current !== coursesSignature) {
        runGeneration([]);
      }
      return;
    }

    if (lastGeneratedSignatureRef.current === coursesSignature) {
      return;
    }

    runGeneration();
  }, [coursesSignature, hasCourses, runGeneration]);

  // Setting the results of search bar
  const [results, setResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // Setting the selected tag for filtering
  const [selectedTag, setSelectedTag] = useState({
    value: "all",
    label: "All",
  });

  // Filter options
  const tagOptions = [
    { value: "all", label: "All" },
    { value: "010", label: "Accounting (010)" },
    { value: "011", label: "Administrative Studies (011)" },
  ];

  const fetchAPI = async (searchInput, selectedTag) => {
    const data = await SearchAPI(searchInput, selectedTag);
    setResults(data);
  };

  // Callback function to refresh saved schedules after saving
  const handleScheduleSaved = () => {
    if (
      savedSchedulesRef.current &&
      savedSchedulesRef.current.loadSavedSchedules
    ) {
      savedSchedulesRef.current.loadSavedSchedules();
    }
  };

  // Handle tab switching
  const handleTabSwitch = (newTab) => {
    setActiveTab(newTab);
  };

  return (
    <div className="course_list_inner">
      <div className="button_row">
        <button
          className={`course_list_search_button ${
            activeTab === "SEARCH" ? "active" : ""
          }`}
          onClick={() => handleTabSwitch("SEARCH")}
          id="headerText"
        >
          SEARCH
        </button>
        <button
          className={`course_list_section_button ${
            activeTab === "SECTION" ? "active" : ""
          }`}
          onClick={() => handleTabSwitch("SECTION")}
          id="headerText"
        >
          SELECTED
        </button>
        <button
          className={`course_list_schedule_button ${
            activeTab === "SCHEDULE" ? "active" : ""
          }`}
          onClick={() => handleTabSwitch("SCHEDULE")}
          id="headerText"
        >
          SCHEDULE
        </button>
        <LogoutButton />
        <SaveButton
          courses={courses}
          user={user}
          onScheduleSaved={handleScheduleSaved}
        />
        <RegisterButton courses={courses} />
      </div>
      {/* Tab Content */}
      <div
        className={`course_list ${
          activeTab === "SEARCH"
            ? "search-bg"
            : activeTab === "SECTION"
              ? "section-bg"
              : "schedule-bg"
        }`}
      >
        {activeTab === "SEARCH" ? (
          <div className="course_list_text">
            <div className="search-bar-container">
              <div className="course_list_header">
                <SearchBar
                  setResults={setResults}
                  selectedTag={selectedTag.value}
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                />
                <div className="subject-filter">
                  <Select
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    id="subject_filter"
                    options={tagOptions}
                    value={selectedTag}
                    onChange={(option) => {
                      setSelectedTag(option);
                      fetchAPI(searchInput, option.value);
                    }}
                    unstyled
                    classNames={{
                      control: () => "rs-control",
                      menu: () => "rs-menu",
                      option: ({ isFocused, isSelected }) =>
                        `rs-option${isSelected ? " rs-option-selected" : ""}${
                          isFocused ? " rs-option-focused" : ""
                        }`,
                      placeholder: () => "rs-placeholder",
                      singleValue: () => "rs-single-value",
                      dropdownIndicator: () => "rs-indicator",
                      indicatorSeparator: () => "rs-separator",
                    }}
                  />
                </div>
              </div>
              <SearchResultsList
                results={results}
                courses={courses}
                setCourses={setCourses}
                setInfo={setInfo}
                setActiveTab={handleTabSwitch}
                setPreviewSection={setPreviewSection}
                selectedTag={selectedTag.value}
                specialFilters={specialFilters}
              />
            </div>
          </div>
        ) : activeTab === "SECTION" ? (
          <div
            className="course_list_text"
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <h1 className="selected_courses_text">Selected Courses</h1>
            <div
              style={{
                width: "100%",
                padding: "1em",
                boxSizing: "border-box",
                minHeight: "100%",
                overflowY: "auto",
                maxHeight: "100%",
              }}
            >
              {courses.length === 0 ? (
                <p className="no_courses_selected_text">
                  No courses selected yet!
                </p>
              ) : (
                <div className="courses_list">
                  {courses && courses.length > 0
                    ? courses.map((course, index) => (
                        <SearchResult
                          key={course.course_number || index}
                          result={course}
                          courses={courses}
                          setCourses={setCourses}
                          setPreviewSection={setPreviewSection}
                          specialFilters={specialFilters}
                        />
                      ))
                    : null}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="schedule_container">
            <div className="randomizer_container">
              randomizer + schedule next and behind generator put here
              <ScheduleGenerator
                courses={courses}
                generatedSchedules={generatedSchedules}
                onGenerate={(schedules) => {
                  runGeneration(schedules);
                  console.log("Received schedules from generator:", schedules);
                }}
              />
              {generatedSchedules && generatedSchedules.length > 0 && (
                <ScheduleNavigator
                  schedules={generatedSchedules}
                  courses={
                    originalCoursesForSchedules.length > 0
                      ? originalCoursesForSchedules
                      : courses
                  }
                  setGeneratedCourses={setGeneratedCourses}
                  selectedIndex={selectedScheduleIndex}
                  onSelectedIndexChange={setSelectedScheduleIndex}
                  onScheduleSelect={(schedule, index) => {
                    console.log(`Selected schedule ${index + 1}:`, schedule);
                  }}
                />
              )}
            </div>
            <div className="saved_schedule_container">
              <SavedSchedules ref={savedSchedulesRef} user={user} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList;
