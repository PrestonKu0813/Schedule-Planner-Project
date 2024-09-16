import "./course_list.css";

function CourseList() {
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
        <p className="course_list_text">SEARCH BAR :D</p>
      </div>
    </>
  );
}

export default CourseList;
