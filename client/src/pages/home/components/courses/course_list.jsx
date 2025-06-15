import "./course_list.css";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResultsList } from "../SearchBar/SearchResultsList";
import { useState, useEffect } from "react";
import Select from "react-select";


function CourseList({
  courses,
  setCourses,
  info,
  setInfo,
  activeTab,
  setActiveTab,
}) {
  const [results, setResults] = useState([]);
  const [selectedTag, setSelectedTag] = useState({
    value: "all",
    label: "All",
  });

  const tagOptions = [
    { value: "all", label: "All" },
    { value: "010", label: "Accounting (010)" },
    { value: "011", label: "Administrative Studies (011)" },
  ];

  // const handleTabChange = (tab) => {
  //   setActiveTab(tab);
  // }
  // useEffect(() => {
  //   handleTabChange(activeTab);
  // }, [activeTab]);

  return (
    <div className="course_list_inner">
      <div className="button_row">
        <button
          className={`course_list_explore_button ${
            activeTab === "EXPLORE" ? "active" : ""
          }`}
          onClick={() => setActiveTab("EXPLORE")} 
          id = "headerText"
        >
          EXPLORE
        </button>

        <button
          className={`course_list_courses_button ${
            activeTab === "COURSES" ? "active" : ""
          }`}
          onClick={() => setActiveTab("COURSES")}
          id = "headerText"
        >
          COURSES
        </button>
      </div>
      {/* Tab Content */}
      <div
        className={`course_list ${activeTab === "EXPLORE" ? "explore-bg" : "courses-bg"}`}
      >
        {activeTab === "EXPLORE" ? (
          <div className="course_list_text">
            <div className="search-bar-container">
              <div className="course_list_header">
                <SearchBar
                  setResults={setResults}
                  selectedTag={selectedTag.value}
                />
                <div className="subject-filter">              
                  <Select
                    id="subject_filter"
                    options={tagOptions}
                    value={selectedTag}
                    onChange={setSelectedTag}
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
              />
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
