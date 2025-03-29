import "./course_list.css";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResultsList } from "../SearchBar/SearchResultsList";
import { useState } from 'react';
import Select from 'react-select';

function CourseList({courses, setCourses}) {
  const [activeTab, setActiveTab] = useState("EXPLORE");
  const [results, setResults] = useState([]);
  const [selectedTag, setSelectedTag] = useState({ value: "all", label: "All" });

  const tagOptions = [
    { value: "all", label: "All" },
    { value: "010", label: "Accounting (010)" },
    { value: "011", label: "Administrative Studies (011)" },
  ];




  return (
    <div>
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
              <SearchResultsList results={results} courses={courses} setCourses={setCourses}/>
            </div>
          </div>
        ) : (
          <div className="course_list_text">
            <h2>Courses Tab</h2>
            <p>Welcome to the Courses tab!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList;