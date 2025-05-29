import React from 'react';
import "./Section.css";

export const Section = ({ section, selectedSections, setSelectedSections }) => {
    const isSelected = selectedSections.some(
        (selected) => selected.index_number === section.index_number
    );

    const handleButtonClick = () => {
        if (isSelected) {
            setSelectedSections(
                selectedSections.filter(
                    (selected) => selected.index_number !== section.index_number
                )
            );
        } else {
            setSelectedSections([...selectedSections, section]);
        }
    };

    return (
        <div className="section">
            <div className="section-details">
                <p>Section Number: {section.section_number}</p>
                <p>Index Number: {section.index_number}</p>
                <p>Instructor: {section.instructor}</p>
            </div>
            <button
                className={`section-button ${isSelected ? "selected" : ""}`}
                onClick={handleButtonClick}
            >
            </button>
        </div>
    );
};