import React, { useState, useRef, useEffect } from "react";
import "./SearchResult.css";

export const SearchResult = ({ result }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //             setIsOpen(false);
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => document.removeEventListener("mousedown", handleClickOutside);
    // }, [dropdownRef]);

    return (
        <div className="search-result" ref={dropdownRef}>
            <div className="result-header" onClick={toggleDropdown}>
                {result.name}
                <button> {isOpen ? '  ▲' : '  ▼'}</button>
            </div>
            {isOpen && (
                <div className="dropdown">
                    <p>Email: {result.email}</p>
                    <p>Phone: {result.phone}</p>
                    <p>Website: {result.website}</p>
                    {/* Add more details as needed */}
                </div>
            )}
        </div>
    );
};