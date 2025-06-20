import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./Search.css";
import {
    courseByCourseNumber,
    sectionsByCourseNumber,
    courseSearch,
    getAllCourses,
    getAllSubjects,
    subjectBySubjectCode,
    coursesBySubjectCode,
} from "../api";

/**
 * 
 * @param {*} props
 * @param {Function} props.setResults - Function to set the search results.
 * @param {string} props.selectedTag - The currently selected tag for filtering results.
 * @description A search bar component that allows users to search for courses and filter results based on a selected tag.
 * It fetches data from an API based on the input value and updates the results accordingly.
 * @returns 
 */

export const SearchBar = ({ setResults, selectedTag }) => {
    const [input, setInput] = useState("");
    const [tempInput, setTempInput] = useState("");


    // Function to fetch all courses from search query
    const fetchAPI = (value) => {
        if (value === "") {
            // If input is empty, fetch all courses
            getAllSubjects()
                .then((json) => {
                    console.log("API Response:", json);
                    if (json.message === "not result") {
                        setResults([]);
                        return;
                    }
                    const resultsArray = Object.values(json).flatMap(subject =>
                        Object.values(subject.courses).map(course => ({
                            ...course,
                            selected_sections: [], // Add selected_sections attribute
                        }))
                    );
                    //filtering based on selectedTag, uses course_number to filter
                    const filteredResults = selectedTag === "all"
                        ? resultsArray
                        : resultsArray.filter(result => {
                            const coreCodeParts = result.course_number.split(":");
                            return coreCodeParts[1] === selectedTag;
                        });
                    setResults(filteredResults);
                });
        } else {
            courseSearch(value)
                .then((json) => {
                    console.log("API Response:", json);
                    if (json.message === "not result") {
                        setResults([]);
                        return;
                    }
                    const resultsArray = Object.values(json).map(course => ({
                        ...course,
                        selected_sections: [], // Add selected_sections attribute
                    }));

                    //filtering based on selectedTag. uses course_number to filter
                    const filteredResults = selectedTag === "all"
                        ? resultsArray
                        : resultsArray.filter(result => {
                            const coreCodeParts = result.course_number.split(":");
                            return coreCodeParts[1] === selectedTag;
                        });
                    setResults(filteredResults);
                });
        }
    };

    useEffect(() => {
        // Fetch data initially without any filtering
        fetchAPI(input);
    }, [selectedTag]); // Add selectedTag as a dependency to refetch data when it changes

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(tempInput);
        }
    };

    //runs fetchAPI and sets the input value when the user submits the search
    const handleSubmit = (value) => {
        setInput(value);
        fetchAPI(value);
    };

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
                type="text"
                placeholder="Search..."
                value={tempInput}
                onChange={(e) => {
                    setTempInput(e.target.value);
                }}
                onKeyDown={(e) => handleKeyDown(e)}
                autoComplete="off"
            />
        </div>
    );
};