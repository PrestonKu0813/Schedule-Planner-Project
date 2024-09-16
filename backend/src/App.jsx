import CourseList from "./main_page/courses/course_list";
import Calendar from "./main_page/calendar/calendar";
import Selected_Courses from "./main_page/selected_courses/selected_courses_list";

function App() {
  return (
    <>
      <Selected_Courses/>
      <CourseList/>
      <Calendar />
    </>
  );
}

export default App;
