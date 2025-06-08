import React from 'react';
import "./Search.css";
import { SearchResult } from './SearchResult';

export const SearchResultsList = ({results, courses, setCourses, setInfo, setActiveTab}) => {
    return (
        <div className="results-list">
            {
                results.map((result, id) => {
                    result.selected_sections = [];
                    return <SearchResult result={result} key={id} courses={courses} setCourses={setCourses} setInfo={setInfo} setActiveTab={setActiveTab}/>;
                })
            }
        </div>
    )
}