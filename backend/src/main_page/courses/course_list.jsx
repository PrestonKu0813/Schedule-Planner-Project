import "./tabs.css"
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResultsList } from "../SearchBar/SearchResultsList";
import { useState } from 'react';

function CourseList() {

  const [activeTab, setActiveTab] = useState("Explore");

  const [results, setResults] = useState([]);

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
              <SearchBar setResults={setResults} />
              <SearchResultsList results={results}/>

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