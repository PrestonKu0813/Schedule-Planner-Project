import React from "react";
import "./Search.css";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({
  results,
  courses,
  setCourses,
  setPreviewSection,
  selectedTag,
  specialFilters,
}) => {
  // Filter results based on credit AND core_code
  const filteredResults = results.filter((result) => {
    // --- Credit filter ---
    const creditValue = Math.floor(parseFloat(result.credit));
    const creditMatch =
      specialFilters.credit.length === 0 ||
      specialFilters.credit.some((filterCredit) => {
        const filterCreditValue = Math.floor(parseFloat(filterCredit));
        return filterCreditValue === creditValue;
      });

    // --- Core code filter ---
    // result.core_code can be an array or string
    const coreCodes = Array.isArray(result.core_code)
      ? result.core_code
      : typeof result.core_code === "string" ||
          typeof result.core_code === "number"
        ? [String(result.core_code)]
        : [];
    const coreCodeMatch = coreCodes.some((code) =>
      specialFilters.coreCode.includes(code)
    );

    // Both filters must match
    console.log("coreCodes:", coreCodes);
    console.log("specialFilters.coreCode:", specialFilters.coreCode);
    console.log("creditMatch:", creditMatch, "coreCodeMatch:", coreCodeMatch);
    return creditMatch && coreCodeMatch;
  });

  if (filteredResults.length === 0) {
    return <div className="no-results">No results found</div>;
  } else {
    return (
      <div className="results-list">
        {filteredResults.map((result, id) => {
          // Find a matching course by course_number
          const matchedCourse = courses.find(
            (course) => course.course_number === result.course_number
          );
          // Set selected_sections to match, or empty array if not found
          result.selected_sections = matchedCourse
            ? matchedCourse.selected_sections
            : [];

          return (
            <SearchResult
              result={result}
              key={id}
              courses={courses}
              setCourses={setCourses}
              setPreviewSection={setPreviewSection}
              specialFilters={specialFilters}
            />
          );
        })}
      </div>
    );
  }
};
