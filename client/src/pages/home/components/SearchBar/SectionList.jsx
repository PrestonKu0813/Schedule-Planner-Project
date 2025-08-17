import React from "react";
import "./search.css";
import { Section } from "./Section";

export const SectionList = ({
  sections,
  selectedSections,
  setSelectedSections,
  setPreviewSection,
  courseInfo,
  specialFilters,
}) => {
  // Filter sections based on campus
  const filteredSections = sections.filter((section) => {
    const campusList = Object.values(section.lecture_info)
      .map((infoObj) => infoObj.campus)
      .filter(Boolean);

    return !(
      campusList.some((campus) => !specialFilters.campus.includes(campus)) ||
      (specialFilters.campus.length > 0 &&
        !campusList.some((campus) => specialFilters.campus.includes(campus)))
    );
  });

  return (
    <div className="section-list">
      {filteredSections.length === 0 ? (
        <div className="no-sections">
          No sections available for this course with current filter options.
        </div>
      ) : (
        <>
          <div className="section-header">
            <span>Section</span>
            <span>Index</span>
            <span>Instructor</span>
          </div>
          {filteredSections.map((section, id) => (
            <Section
              section={section}
              key={id}
              selectedSections={selectedSections}
              setSelectedSections={setSelectedSections}
              setPreviewSection={setPreviewSection}
              courseInfo={courseInfo}
            />
          ))}
        </>
      )}
    </div>
  );
};
