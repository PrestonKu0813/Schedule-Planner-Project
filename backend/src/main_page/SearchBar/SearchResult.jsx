import React, { useState, useRef, useEffect } from "react";
import "./SearchResult.css";
import { SectionList } from "./SectionList";
import {
    sectionsByCourseNumber,
} from "../api";

export const SearchResult = ({ result, courses, setCourses }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sections, setSections] = useState([]);
    const [selectedSections, setSelectedSections] = useState(result.selected_sections || []); // Initialize from result
    const isCourseInList = courses.some(course => course.course_number === result.course_number);
    const [isCourseAdded, setIsCourseAdded] = useState(isCourseInList);
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

    useEffect(() => {
        sectionsByCourseNumber(result.course_number).then((data) => {
            setSections(Object.values(data));
        });
    }, [result.course_number]);

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
                    <p>Selected Sections: {selectedSections.map(section => section.section_number).join(", ")}</p>
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