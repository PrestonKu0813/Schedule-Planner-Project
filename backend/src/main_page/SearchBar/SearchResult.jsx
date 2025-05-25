import React, { useState, useRef, useEffect } from "react";
import "./SearchResult.css";
import { SectionList } from "./SectionList";
import { sectionsByCourseNumber } from "../api";

export const SearchResult = ({ result, courses, setCourses, setInfo, setActiveTab }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sections, setSections] = useState([]);
    const [selectedSections, setSelectedSections] = useState(result.selected_sections || []); // Initialize from result
    const isCourseInList = courses.some(course => course.course_number === result.course_number);
    const [isCourseAdded, setIsCourseAdded] = useState(isCourseInList);
    const [isAllSectionsSelected, setIsAllSectionsSelected] = useState(false); // Track toggle state
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

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
        sectionsByCourseNumber(result.course_number).then((data) => {
            const sectionList = Object.values(data);
            setSections(sectionList);

            // Check if all sections are already selected
            setIsAllSectionsSelected(
                sectionList.length > 0 &&
                sectionList.every(section =>
                    selectedSections.some(selected => selected.index_number === section.index_number)
                )
            );
        });
    }, [result.course_number, selectedSections]);

    useEffect(() => {
        setIsCourseAdded(courses.some(course => course.course_number === result.course_number));
    }, [courses, result.course_number]);

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