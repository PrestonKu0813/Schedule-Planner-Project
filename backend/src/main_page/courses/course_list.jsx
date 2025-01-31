import "./course_list.css";

function CourseList() {
  return (
    <div>
      <button
        className={`course_list_explore_button ${
          activeTab === "EXPLORE" ? "active" : ""
        }`}
        onClick={() => setActiveTab("EXPLORE")}
      >
        EXPLORE
      </button>

      <button
        className={`course_list_courses_button ${
          activeTab === "COURSES" ? "active" : ""
        }`}
        onClick={() => setActiveTab("COURSES")}
      >
        COURSES
      </button>

      <div className="course_list">
        <h1 className="course_list_text">THIS IS MY COURSE LIST YEHAW</h1>
        <p className="course_list_text">SEARCH BAR :D</p>
      </div>
    </div>
  );
}

export default Tabs;