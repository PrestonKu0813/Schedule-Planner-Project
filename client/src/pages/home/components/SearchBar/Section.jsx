import React from 'react';
import "./Search.css";

// Helper function to determine if a section is online
const isOnlineSection = (section) => {
  if (!section.lecture_info) return false;
  
  const lectureInfoArray = Object.values(section.lecture_info);
  return lectureInfoArray.every(lecture => 
    lecture.lectureDay === "Asynchronous content" || 
    lecture.lectureDay === "Hours by arrangement" ||
    lecture.lectureDay === "-1" ||
    lecture.campus === "Online" ||
    lecture.campus === -1
  );
};

export const Section = ({ section, selectedSections, setSelectedSections, setPreviewSection, courseInfo }) => {
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

    const handleMouseEnter = () => {
        // Create preview data with course info and section
        const previewData = {
            course: courseInfo,
            section: section,
            isConflict: false // Will be determined by calendar
        };
        setPreviewSection(previewData);
    };

    const handleMouseLeave = () => {
        setPreviewSection(null);
    };

    return (
        <div 
            className="section"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="section-details">
                <p>Section Number: {section.section_number}</p>
                <p>Index Number: {section.index_number}</p>
                <p>Instructor: {section.instructor}</p>
                {isOnlineSection(section) && (
                    <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                        Asynchronous content
                    </p>
                )}
            </div>
            <button
                className={`section-button ${isSelected ? "selected" : ""}`}
                onClick={handleButtonClick}
            >
            </button>
        </div>
    );
};