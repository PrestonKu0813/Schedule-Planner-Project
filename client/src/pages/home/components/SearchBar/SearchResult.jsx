import React, { useState, useRef, useEffect } from "react";
import "./Search.css";
import { SectionList } from "./SectionList";
import { sectionsByCourseNumber } from "../api";

/**
 * 
 * @param {*} props
 * @param {Object} props.result - The course result object containing course details.
 * @param {Array} props.courses - Array of currently selected courses.
 * @param {Function} props.setCourses - Function to update the selected courses.
 * @param {Function} props.setInfo - Function to set the course info for details view.
 * @param {Function} props.setActiveTab - Function to set the active tab in the UI.
 * @description Component to display a single search result with options to view details, add/remove course, and select sections.
 * @returns 
 */

export const SearchResult = ({ result, courses, setCourses, setInfo, setActiveTab }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sections, setSections] = useState([]);
    const [selectedSections, setSelectedSections] = useState(result.selected_sections || []); // Initialize from result
    const isCourseInList = courses.some(course => course.course_number === result.course_number);
    const [isCourseAdded, setIsCourseAdded] = useState(isCourseInList);
    const [isAllSectionsSelected, setIsAllSectionsSelected] = useState(false); // Track toggle state
    const dropdownRef = useRef(null);

    // toggles the dropdown visibility
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // adds or removes the course from the selected courses list
    const handleAddRemoveCourse = (e) => {
        e.stopPropagation();
        if (isCourseAdded) {
            // Remove course from selected courses
            setCourses(courses.filter(course => course.course_number !== result.course_number));
        } else {
            // Add course to selected courses with selected_sections initialized
            setCourses([...courses, { ...result, selected_sections: selectedSections }]);
        }
        setIsCourseAdded(!isCourseAdded);
    };

    // Toggles all sections: if all are selected, deselects them; otherwise, selects all
    const handleToggleAllSections = () => {
        if (isAllSectionsSelected) {
            // Untoggle: Remove all sections
            setSelectedSections([]);
        } else {
            // Toggle: Add all sections
            setSelectedSections(sections);
        }
        setIsAllSectionsSelected(!isAllSectionsSelected);
    };

    useEffect(() => {
        setIsCourseAdded(courses.some(course => course.course_number === result.course_number));
    }, [courses, result.course_number]);

    useEffect(() => {
        sectionsByCourseNumber(result.course_number).then((data) => {
            const sectionList = Object.values(data);
            setSections(sectionList);
            if (!isCourseAdded) {
                setSelectedSections(sectionList); // Reset selected sections if course is not added
            }
            else {
                const matchedCourse = courses.find(course => course.course_number === result.course_number);
                // Set selected_sections to match, or empty array if not found
                result.selected_sections = matchedCourse.selected_sections || [];
                setSelectedSections(result.selected_sections);
            }
            // Check if all sections are already selected
            setIsAllSectionsSelected(
                sectionList.length > 0 &&
                sectionList.every(section =>
                    selectedSections.some(selected => selected.index_number === section.index_number)
                )
            );
        });
    }, [result.course_number, isCourseAdded]);

    useEffect(() => {
        // Check if all sections are selected
        setIsAllSectionsSelected(
            sections.length > 0 &&
            sections.every(section =>
                selectedSections.some(selected => selected.index_number === section.index_number)
            )
        );
    }
    , [sections, selectedSections]);


    // Update result.selected_sections whenever selectedSections changes
    useEffect(() => {
        result.selected_sections = selectedSections;
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
    }, [selectedSections, isCourseAdded, result.course_number, setCourses]);

    return (
        <div className="search-result" ref={dropdownRef}>
            <div className="result-header" onClick={toggleDropdown}>
                <div className="result-title">{result.course_name}</div>
                <button
                    className="set-info-button"
                    onClick={e => {
                        e.stopPropagation();
                        setInfo(result);
                        setActiveTab("COURSES");
                    }}
                >
                    Details
                </button>
                <button
                    onClick={handleAddRemoveCourse}
                    className={isCourseAdded ? 'remove-course-button' : 'add-course-button'}
                >
                    {isCourseAdded ? '-' : '+'}
                </button>
                <button>{isOpen ? '▲' : '▼'}</button>
            </div>
            {isOpen && (
                <div className="dropdown">
                    <p>Course Number: {result.course_number}</p>
                    <p>Credits: {result.credit}</p>
                    <p>Core Codes: {result.core_code}</p>
                    <p>Selected Sections: {!isAllSectionsSelected ? (selectedSections.length != 0 ? selectedSections.map(section => section.section_number).join(", ") : "None") : "All"}</p>
                    <button
                        className={`toggle-all-sections-button ${isAllSectionsSelected ? "toggled" : ""}`}
                        onClick={handleToggleAllSections}
                    >
                        {isAllSectionsSelected ? "Deselect All Sections" : "Select All Sections"}
                    </button>
                    <SectionList 
                        sections={sections} 
                        selectedSections={selectedSections} 
                        setSelectedSections={setSelectedSections} 
                    />
                </div>
            )}
        </div>
    );
};