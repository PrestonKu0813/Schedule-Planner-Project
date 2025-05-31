import "./tabs.css";
import "./course_list.css";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResultsList } from "../SearchBar/SearchResultsList";
import { useState, useEffect } from 'react';
import Select from 'react-select';

/**
 * 
 * @param {*} props
 * @param {Array} props.courses - Array of course objects.
 * @param {Function} props.setCourses - Function to update the courses state.
 * @param {Object} props.info - Object containing information about the selected course.
 * @param {Function} props.setInfo - Function to update the info state.
 * @param {string} props.activeTab - Currently active tab, either "EXPLORE" or "COURSES".
 * @param {Function} props.setActiveTab - Function to set the active tab.
 * @description In charge of middle section of the home page, which contains the Explore and Courses tabs.
 * @returns
 */

function CourseList({courses, setCourses, info, setInfo, activeTab, setActiveTab}) {

  //setting the results of search bar
  const [results, setResults] = useState([]);

  //setting the selected tag for filtering
  const [selectedTag, setSelectedTag] = useState({ value: "all", label: "All" });

  //filter options
  const tagOptions = [
    { value: "all", label: "All" },
    { value: "010", label: "Accounting (010)" },
    { value: "011", label: "Administrative Studies (011)" },
  ];

  return (
    <div>
      {/* Tab Buttons */}
      <button
        className={`course_list_explore_button ${
          activeTab === "EXPLORE" ? "active" : ""
        }`}
        onClick={() => setActiveTab("EXPLORE")}
      >
        EXPLORE
      </button>

      <button
        className={`course_list_courses_button ${
          activeTab === "COURSES" ? "active" : ""
        }`}
        onClick={() => setActiveTab("COURSES")}
      >
        COURSES
      </button>

      {/* Tab Content */}
      <div className="course_list">
        {activeTab === "EXPLORE" ? (
          <div className="course_list_text">
            <h2>Explore Tab</h2>
            <div className="search-bar-container">
              <SearchBar setResults={setResults} selectedTag={selectedTag.value} />
              <div className="subject-filter">
                <label htmlFor="userId">Filter by Subject:</label>
                <Select
                  id="subject_filter"
                  options={tagOptions}
                  value={selectedTag}
                  onChange={setSelectedTag}
                />
              </div>
              <SearchResultsList results={results} courses={courses} setCourses={setCourses} setInfo={setInfo} setActiveTab={setActiveTab}/>
            </div>
          </div>
        ) : (
          <div className="course_list_text">
            <h2>Courses Tab</h2>
            <p>Welcome to the Courses tab!</p>
            <p>Selected Info: {info.course_name}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList;