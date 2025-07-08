import "./course_list.css";
import { useUser } from "../../../../contexts/UserContext";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResultsList } from "../SearchBar/SearchResultsList";
import { useState, useEffect } from "react";
import { SearchAPI } from "../SearchBar/SearchAPI.js";
import LogoutButton from "../buttons/logout_button";
import SaveButton from "../save_button/save_button";
import Select from "react-select";
import searchFilter from "../enums/search_filter.js";
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
}) {
  const { user } = useUser();
  const { campus } = searchFilter;

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

  const [showFilters, setShowFilters] = useState(false);

  const [specialFilters, setSpecialFilters] = useState({
    campus: [campus.BU, campus.LI, campus.CA, campus.CD],
    time: [],
    day: [],
    credits: [],
  });

  const addCampus = (campus) => {
    setSpecialFilters((prev) => ({
      ...prev,
      campus: [...prev.campus, campus],
    }));
  };

  const removeCampus = (campus) => {
    setSpecialFilters((prev) => ({
      ...prev,
      campus: prev.campus.filter((c) => c !== campus),
    }));
  };

  //specialFilters = {"campus": [], "time": [], "day": []};
  // const handleTabChange = (tab) => {
  //   setActiveTab(tab);
  // }
  // useEffect(() => {
  //   handleTabChange(activeTab);
  // }, [activeTab]);

  const Checkbox = ({ label, isChecked, onClick }) => {
    return (
      <label className="filter-checkbox">
        {label}
        <button
          className={`filter-button ${isChecked ? "selected" : ""}`}
          onClick={onClick}
        ></button>
      </label>
    );
  };

  useEffect(() => {
    // This effect runs whenever specialFilters changes
    // You can add any logic here that needs to run when filters change
    console.log("Special Filters Updated:", specialFilters);
  }, [specialFilters]);

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

        <LogoutButton />
        <SaveButton courses={courses} user={user} />
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

                {/* Additional Filters Dropdown */}
                <div
                  className="additional-filters-dropdown"
                  style={{ position: "relative", marginLeft: "1rem" }}
                >
                  <button
                    onClick={() => setShowFilters((prev) => !prev)}
                    className="additional-filters-toggle"
                    style={{ padding: "0.5rem 1rem" }}
                  >
                    Additional Filters ▼
                  </button>
                  {showFilters && (
                    <div className="additional-filters-menu">
                      <div className="filter-section">
                        <h4>Campus</h4>
                        <Checkbox
                          label="Busch"
                          isChecked={specialFilters.campus.includes(campus.BU)}
                          onClick={() => {
                            if (specialFilters.campus.includes(campus.BU)) {
                              removeCampus(campus.BU);
                            } else {
                              addCampus(campus.BU);
                            }
                          }}
                        />
                        <Checkbox
                          label="Livingston"
                          isChecked={specialFilters.campus.includes(campus.LI)}
                          onClick={() => {
                            if (specialFilters.campus.includes(campus.LI)) {
                              removeCampus(campus.LI);
                            } else {
                              addCampus(campus.LI);
                            }
                          }}
                        />
                        <Checkbox
                          label="College Avenue"
                          isChecked={specialFilters.campus.includes(campus.CA)}
                          onClick={() => {
                            if (specialFilters.campus.includes(campus.CA)) {
                              removeCampus(campus.CA);
                            } else {
                              addCampus(campus.CA);
                            }
                          }}
                        />
                        <Checkbox
                          label="Cook/Douglass"
                          isChecked={specialFilters.campus.includes(campus.CD)}
                          onClick={() => {
                            if (specialFilters.campus.includes(campus.CD)) {
                              removeCampus(campus.CD);
                            } else {
                              addCampus(campus.CD);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
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
          <div className="course_list_text">
            <h2>Courses Tab</h2>
            <p>Welcome to the Courses tab!</p>
            <p>Selected Info: {info.course_name}</p>
          </div>
        ) : (
          <div className="schedule_container">
            <div className="randomizer_container">
              {" "}
              randomizer + schedule next and behind generator put here
            </div>
            <div className="saved_schedule_container">
              saved list goes here{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList;
