import { useState, useEffect } from "react";
import axios from "axios";
import CourseList from "./main_page/courses/course_list";

function App() {
  async function subjectAPI(params) {
    const response = await axios.get("http://localhost:3000/explore/010");
    console.log(response.data);
  }

  useEffect(() => {
    subjectAPI();
  }, []);

  return (
    <>
      <CourseList></CourseList>
    </>
  );
}

export default App;
