import React, { useState, useRef, useEffect } from "react";
import "./SearchResult.css";
import { SectionList } from "./SectionList";
import {
    courseByCourseNumber,
    sectionsByCourseNumber,
    courseSearch,
    getAllCourses,
    getAllSubjects,
    subjectBySubjectCode,
    coursesBySubjectCode,
} from "../api";

export const SearchResult = ({ result, courses, setCourses }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sections, setSections] = useState([]);
    const isCourseInList = courses.some(course => course.course_number === result.course_number);
    const [isCourseAdded, setIsCourseAdded] = useState(isCourseInList);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleAddRemoveCourse = (e) => {
        e.stopPropagation(); // Stop event propagation to prevent triggering the dropdown
        if (isCourseAdded) {
            // Remove course from selected courses
            setCourses(courses.filter(course => course.course_number !== result.course_number));
        } else {
            // Add course to selected courses
            setCourses([...courses, result]);
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
        console.log(courses);
    }, [courses, result.course_number]);

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
                    <SectionList sections={sections} />
                    {/* Add more details as needed */}
                </div>
            )}
        </div>
    );
};