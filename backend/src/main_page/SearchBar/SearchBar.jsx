import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
    const [input, setInput] = useState("");
    const [tempInput, setTempInput] = useState("");

    const fetchData = (value) => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((response) => response.json())
            .then((json) => {
                let results;
                if (value) {
                    results = json.filter((user) => {
                        return (
                            user &&
                            user.name &&
                            user.name.toLowerCase().includes(value.toLowerCase())
                        );
                    });
                } else {
                    results = json;
                }
                setResults(results);
            });
    };

    useEffect(() => {
        // Fetch data initially without any filtering
        fetchData("");
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(tempInput);
        }
    };

    const handleSubmit = (value) => {
        setInput(value);
        fetchData(value);
    };

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
                type="text"
                placeholder="Type to search..."
                value={tempInput}
                onChange={(e) => setTempInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                autoComplete="off"
            />
        </div>
    );
};