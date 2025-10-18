import "./course_list.css";
import { useUser } from "../../../../contexts/UserContext";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResultsList } from "../SearchBar/SearchResultsList";
import { useState, useEffect, useRef } from "react";
import { SearchAPI } from "../SearchBar/SearchAPI.js";
import LogoutButton from "../save_button/logout_button.jsx";
import SaveButton from "../save_button/save_button";
import SavedSchedules from "../saved_schedules/saved_schedules";
import Select from "react-select";
import searchFilter from "../enums/search_filter.js";
import RegisterButton from "../save_button/RegisterButton.jsx";
/**
 *
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
  info,
  setInfo,
  activeTab,
  setActiveTab,
  setPreviewSection,
  specialFilters,
  setSpecialFilters,
}) {
  const { user } = useUser();

  const { campus } = searchFilter;
  const savedSchedulesRef = useRef(null);

  //setting the results of search bar
  const [results, setResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  //setting the selected tag for filtering
  const [selectedTag, setSelectedTag] = useState({
    value: "all",
    label: "All",
  });

  //filter options
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

  return (
    <div className="course_list_inner">
      <div className="button_row">
        <button
          className={`course_list_search_button ${
            activeTab === "SEARCH" ? "active" : ""
          }`}
          onClick={() => setActiveTab("SEARCH")}
          id="headerText"
        >
          SEARCH
        </button>

        <button
          className={`course_list_section_button ${
            activeTab === "SECTION" ? "active" : ""
          }`}
          onClick={() => setActiveTab("SECTION")}
          id="headerText"
        >
          SECTION
        </button>
        <button
          className={`course_list_schedule_button ${
            activeTab === "SCHEDULE" ? "active" : ""
          }`}
          onClick={() => setActiveTab("SCHEDULE")}
          id="headerText"
        >
          SCHEDULE
        </button>

        <div className="button_row_left">
          <SaveButton
            courses={courses}
            user={user}
            onScheduleSaved={handleScheduleSaved}
          />
          <RegisterButton courses={courses} />
          <LogoutButton />
        </div>
      </div>
      {/* Tab Content */}
      <div
        className={`course_list ${activeTab === "SEARCH" ? "search-bg" : activeTab === "SECTION" ? "section-bg" : "schedule-bg"}`}
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
                setActiveTab={setActiveTab}
                setPreviewSection={setPreviewSection}
                selectedTag={selectedTag.value}
                specialFilters={specialFilters}
              />
            </div>
          </div>
        ) : activeTab === "SECTION" ? (
          <div
            className="course_list_text"
            style={{ display: "flex", flexDirection: "row", height: "100%" }}
          >
            {/* Left Panel: Selected Courses List */}
            <div
              style={{
                width: "25%",
                padding: "1em",
                boxSizing: "border-box",
                minHeight: "100%",
                overflowY: "auto",
                maxHeight: "100%",
              }}
            >
              <h1 className="selected_courses_text">Selected Courses</h1>
              {courses.length === 0 ? (
                <p className="no_courses_selected_text">
                  No courses selected yet!
                </p>
              ) : (
                <ul className="courses_list">
                  {courses.map((course, index) => (
                    <li key={index} className="course_card">
                      <h2>{course.course_name}</h2>
                      <p>Course Number: {course.course_number}</p>
                      <p>Credits: {course.credit}</p>
                      <p>
                        Selected Sections:{" "}
                        {course.selected_sections &&
                        course.selected_sections.length > 0
                          ? course.selected_sections
                              .map((section) => section.section_number)
                              .join(", ")
                          : "None"}
                      </p>
                      <button
                        className="set-info-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInfo(course);
                          setActiveTab("SECTION");
                        }}
                      >
                        Details
                      </button>
                      <button
                        className="remove_course_button"
                        onClick={() =>
                          setCourses(
                            courses.filter(
                              (c) => c.course_number !== course.course_number
                            )
                          )
                        }
                      >
                        Remove Course
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Right Panel: Existing Content */}
            <div
              style={{
                width: "75%",
                padding: "1em",
                boxSizing: "border-box",
                minHeight: "100%",
              }}
            >
              <h2>Courses Tab</h2>
              <p>Welcome to the Courses tab!</p>
              <p>Selected Info: {info && info.course_name}</p>
            </div>
          </div>
        ) : (
          <div className="schedule_container">
            <div className="randomizer_container">
              {" "}
              randomizer + schedule next and behind generator put here
            </div>
            <div className="saved_schedule_container">
              <SavedSchedules
                ref={savedSchedulesRef}
                user={user}
                setCourses={setCourses}
                courses={courses}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList;
