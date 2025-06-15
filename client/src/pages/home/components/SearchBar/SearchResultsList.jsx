import React from 'react';
import "./Search.css";
import { SearchResult } from './SearchResult';

export const SearchResultsList = ({results, courses, setCourses, setInfo, setActiveTab}) => {
    return (
        <div className="results-list">
            {
                results.map((result, id) => {
                    // Find a matching course by course_number
                    const matchedCourse = courses.find(course => course.course_number === result.course_number);
                    // Set selected_sections to match, or empty array if not found
                    result.selected_sections = matchedCourse ? matchedCourse.selected_sections : [];
                    return (
                        <SearchResult
                            result={result}
                            key={id}
                            courses={courses}
                            setCourses={setCourses}
                            setInfo={setInfo}
                            setActiveTab={setActiveTab}
                        />
                    );
                })
            }
        </div>
    )
}