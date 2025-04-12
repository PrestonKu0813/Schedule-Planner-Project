import React from 'react';
import "./SearchResultsList.css";
import { SearchResult } from './SearchResult';

export const SearchResultsList = ({results, courses, setCourses}) => {
    return (
        <div className="results-list">
            {
                results.map((result, id) => {
                    result.selected_sections = [];
                    return <SearchResult result={result} key={id} courses={courses} setCourses={setCourses}/>;
                })
            }
        </div>
    )
}