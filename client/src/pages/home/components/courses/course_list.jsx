import "./course_list.css";
import { useUser } from "../../../../contexts/UserContext";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResultsList } from "../SearchBar/SearchResultsList";
import { useState, useEffect } from "react";
import { SearchAPI } from "../SearchBar/SearchAPI.js";
import LogoutButton from "../buttons/logout_button";
import SaveButton from "../save_button/save_button";
import SavedSchedules from "../saved_schedules/saved_schedules";
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
  const { credit } = searchFilter;

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
    campus: [campus.BU, campus.LI, campus.CA, campus.CD, campus.ASYNC],
    time: [],
    day: [],
    credit: [
      credit.ONE,
      credit.TWO,
      credit.THREE,
      credit.FOUR,
      credit.CBA,
      credit.NA,
    ],
  });

  // Generalized add to filter
  const addToFilter = (filterKey, value) => {
    setSpecialFilters((prev) => ({
      ...prev,
      [filterKey]: [...prev[filterKey], value],
    }));
  };

  // Generalized remove from filter
  const removeFromFilter = (filterKey, value) => {
    setSpecialFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey].filter((item) => item !== value),
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
                  style={{
                    position: "relative",
                    marginLeft: "1rem",
                    display: "inline-block",
                  }}
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
                              removeFromFilter("campus", campus.BU);
                            } else {
                              addToFilter("campus", campus.BU);
                            }
                          }}
                        />
                        <Checkbox
                          label="Livingston"
                          isChecked={specialFilters.campus.includes(campus.LI)}
                          onClick={() => {
                            if (specialFilters.campus.includes(campus.LI)) {
                              removeFromFilter("campus", campus.LI);
                            } else {
                              addToFilter("campus", campus.LI);
                            }
                          }}
                        />
                        <Checkbox
                          label="College Avenue"
                          isChecked={specialFilters.campus.includes(campus.CA)}
                          onClick={() => {
                            if (specialFilters.campus.includes(campus.CA)) {
                              removeFromFilter("campus", campus.CA);
                            } else {
                              addToFilter("campus", campus.CA);
                            }
                          }}
                        />
                        <Checkbox
                          label="Cook/Douglass"
                          isChecked={specialFilters.campus.includes(campus.CD)}
                          onClick={() => {
                            if (specialFilters.campus.includes(campus.CD)) {
                              removeFromFilter("campus", campus.CD);
                            } else {
                              addToFilter("campus", campus.CD);
                            }
                          }}
                        />
                        <Checkbox
                          label="Async"
                          isChecked={
                            specialFilters.campus.includes(campus.ASYNC) ||
                            specialFilters.campus.includes(campus.ON)
                          }
                          onClick={() => {
                            if (
                              specialFilters.campus.includes(campus.ASYNC) ||
                              specialFilters.campus.includes(campus.ON)
                            ) {
                              removeFromFilter("campus", campus.ASYNC);
                              removeFromFilter("campus", campus.ON);
                            } else {
                              addToFilter("campus", campus.ASYNC);
                              addToFilter("campus", campus.ON);
                            }
                          }}
                        />
                      </div>
                      <div className="filter-section">
                        <h4>Credit</h4>
                        <Checkbox
                          label="One"
                          isChecked={specialFilters.credit.includes(credit.ONE)}
                          onClick={() => {
                            if (specialFilters.credit.includes(credit.ONE)) {
                              removeFromFilter("credit", credit.ONE);
                            } else {
                              addToFilter("credit", credit.ONE);
                            }
                          }}
                        />
                        <Checkbox
                          label="Two"
                          isChecked={specialFilters.credit.includes(credit.TWO)}
                          onClick={() => {
                            if (specialFilters.credit.includes(credit.TWO)) {
                              removeFromFilter("credit", credit.TWO);
                            } else {
                              addToFilter("credit", credit.TWO);
                            }
                          }}
                        />
                        <Checkbox
                          label="Three"
                          isChecked={specialFilters.credit.includes(
                            credit.THREE
                          )}
                          onClick={() => {
                            if (specialFilters.credit.includes(credit.THREE)) {
                              removeFromFilter("credit", credit.THREE);
                            } else {
                              addToFilter("credit", credit.THREE);
                            }
                          }}
                        />
                        <Checkbox
                          label="Four"
                          isChecked={specialFilters.credit.includes(
                            credit.FOUR
                          )}
                          onClick={() => {
                            if (specialFilters.credit.includes(credit.FOUR)) {
                              removeFromFilter("credit", credit.FOUR);
                            } else {
                              addToFilter("credit", credit.FOUR);
                            }
                          }}
                        />
                        <Checkbox
                          label="CBA/NA"
                          isChecked={
                            specialFilters.credit.includes(credit.CBA) ||
                            specialFilters.credit.includes(credit.NA)
                          }
                          onClick={() => {
                            if (
                              specialFilters.credit.includes(credit.CBA) ||
                              specialFilters.credit.includes(credit.NA)
                            ) {
                              removeFromFilter("credit", credit.CBA);
                              removeFromFilter("credit", credit.NA);
                            } else {
                              addToFilter("credit", credit.CBA);
                              addToFilter("credit", credit.NA);
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
            {info && info.course_number ? (
              <div
                className="section-course-info"
                style={{ maxWidth: 600, margin: "0 auto", fontSize: "0.97em" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1.5em 2em",
                    marginBottom: "0.5em",
                  }}
                >
                  <div>
                    <strong>{info.course_name}</strong>
                  </div>
                  <div>
                    <strong>Course #:</strong> {info.course_number}
                  </div>
                  <div>
                    <strong>Credits:</strong> {info.credit}
                  </div>
                </div>
                <div className="section-list">
                  <h4 style={{ margin: "0.5em 0 0.2em 0" }}>Sections</h4>
                  {info.sections && Object.values(info.sections).length > 0 ? (
                    Object.values(info.sections).map((section) => (
                      <div
                        key={section.index_number}
                        className="section-detail"
                        style={{
                          border: "1px solid #eee",
                          borderRadius: "4px",
                          margin: "6px 0",
                          padding: "6px 10px",
                          background: "#fafbfc",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "1.5em 1.5em",
                          }}
                        >
                          <div>
                            <strong>Sec:</strong> {section.section_number}
                          </div>
                          <div>
                            <strong>Index:</strong> {section.index_number}
                          </div>
                          <div>
                            <strong>Instr:</strong>{" "}
                            {section.instructor !== "-1"
                              ? section.instructor
                              : "TBA"}
                          </div>
                        </div>
                        {section.lecture_info &&
                          Object.values(section.lecture_info).map(
                            (infoObj, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "1.5em 1.5em",
                                  marginLeft: "0.5em",
                                  fontSize: "0.96em",
                                }}
                              >
                                <div>
                                  <strong>Day:</strong>{" "}
                                  {infoObj.lectureDay !== -1
                                    ? infoObj.lectureDay
                                    : "TBA"}
                                </div>
                                <div>
                                  <strong>Time:</strong>{" "}
                                  {infoObj.lectureTime !== -1
                                    ? infoObj.lectureTime
                                    : "TBA"}
                                </div>
                                <div>
                                  <strong>Campus:</strong>{" "}
                                  {infoObj.campus !== -1
                                    ? infoObj.campus
                                    : "TBA"}
                                </div>
                                <div>
                                  <strong>Room:</strong>{" "}
                                  {infoObj.classroom !== -1
                                    ? infoObj.classroom
                                    : "TBA"}
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    ))
                  ) : (
                    <p style={{ margin: "0.5em 0" }}>No sections available.</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h2>Courses Tab</h2>
                <p>Welcome to the Courses tab!</p>
                <p>Selected Info: {info && info.course_name}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="schedule_container">
            <div className="randomizer_container">
              {" "}
              randomizer + schedule next and behind generator put here
            </div>
            <div className="saved_schedule_container">
              <SavedSchedules
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
