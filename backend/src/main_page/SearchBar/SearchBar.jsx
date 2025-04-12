import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import {
    courseByCourseNumber,
    sectionsByCourseNumber,
    courseSearch,
    getAllCourses,
    getAllSubjects,
    subjectBySubjectCode,
    coursesBySubjectCode,
} from "../api";

export const SearchBar = ({ setResults, selectedTag }) => {
    const [input, setInput] = useState("");
    const [tempInput, setTempInput] = useState("");

    // const fetchData = (value) => {
    //     fetch("https://jsonplaceholder.typicode.com/todos")
    //         .then((response) => response.json())
    //         .then((json) => {
    //             let results;
    //             if (value) {
    //                 results = json.filter((todo) => {
    //                     return (
    //                         todo &&
    //                         todo.title &&
    //                         todo.title.toLowerCase().includes(value.toLowerCase())
    //                     );
    //                 });
    //             } else {
    //                 results = json;
    //             }
    //             JSON.stringify(results);
    //             const filteredResults = selectedTag === "all"
    //                 ? results
    //                 : results.filter(result => result.userId === parseInt(selectedTag));

    //             setResults(filteredResults);
    //         });
    // };

    const fetchAPI = (value) => {
        if (value === "") {
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
                    })); // Convert object of objects to array of values
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