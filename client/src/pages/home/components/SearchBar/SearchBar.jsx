import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./Search.css";
import {
  courseSearch,
  subjectSearch,
  subjectCourseSearch,
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

export const SearchBar = ({
  setResults,
  selectedTag,
  searchInput,
  setSearchInput,
}) => {
  // Function to fetch all courses from search query
  const fetchAPI = (value) => {
    let resultsArray;
    if (value === "" && selectedTag === "all") {
      // if subject option is all -> show nothing
      setResults([]);
      return;
    } else if (value === "" && selectedTag !== "all") {
      subjectSearch(selectedTag).then((json) => {
        resultsArray = Object.values(json).map((course) => ({
          ...course,
          selected_sections: [], // Add selected_sections attribute
        }));
        setResults(resultsArray);
      });
    } else if (value !== "" && selectedTag === "all") {
      courseSearch(value).then((json) => {
        if (json.message === "no result") {
          setResults([]);
          return;
        }
        resultsArray = Object.values(json).map((course) => ({
          ...course,
          selected_sections: [], // Add selected_sections attribute
        }));
        setResults(resultsArray);
      });
    }
  };

  //   useEffect(() => {
  //     // Fetch data initially without any filtering
  //     fetchAPI(input);
  //   }, [selectedTag]); // Add selectedTag as a dependency to refetch data when it changes

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchInput(searchInput);
      fetchAPI(searchInput);
    }
  };

  //runs fetchAPI and sets the input value when the user submits the search
  //   const handleSubmit = (value) => {
  //     setInput(value);
  //     fetchAPI(value);
  //   };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        type="text"
        placeholder="Search..."
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
        }}
        onKeyDown={(e) => handleKeyDown(e)}
        autoComplete="off"
      />
    </div>
  );
};
