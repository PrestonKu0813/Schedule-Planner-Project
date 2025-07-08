import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./Search.css";
import { SearchAPI } from "./SearchAPI";

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
  const fetchAPI = async (searchInput, selectedTag) => {
    const data = await SearchAPI(searchInput, selectedTag);
    setResults(data);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchInput(searchInput);
      fetchAPI(searchInput, selectedTag);
    }
  };

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
