import CourseList from "./main_page/courses/course_list";
import Calendar from "./main_page/calendar/calendar";
import Selected_Courses from "./main_page/selected_courses/selected_courses_list";

const testCourses = [
  {
    name: "Introduction to Computer Science",
    credits: 3,
    instructor: "Dr. Smith",
  },
  {
    name: "Calculus II",
    credits: 4,
    instructor: "Dr. Johnson",
  },
];

function App() {
  return (
    <>
      <Selected_Courses/>
      <CourseList/>
      <Calendar />
      <div className="App">
        <Selected_Courses selectedCoursesData={testCourses} />
      </div>
    </>
  );
}

export default App;
