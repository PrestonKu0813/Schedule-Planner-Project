import "./course_list.css";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResultsList } from "../SearchBar/SearchResultsList";
import { useState} from 'react';

function CourseList() {

  const [results, setResults] = useState([]);

  return (
    <>
      <div className="course_list_explore_button">
        <h3 className="course_list_text">EXPLORE</h3>
      </div>

      <div className="course_list_courses_button">
      <h3 className="course_list_text">COURSES</h3>
      </div>

      <div className="course_list">
        <h1 className="course_list_text">THIS IS MY COURSE LIST YEHAW</h1>
        <div className="search-bar-container">
            <SearchBar setResults={setResults}/>
            <SearchResultsList results={results}/>
        </div>
      </div>
    </>
  );
}

export default CourseList;
