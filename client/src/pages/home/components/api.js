import axios from "axios";
import apiNames from "./enums/api_names";
const backendURL = import.meta.env.VITE_BACKEND_URL;

// course api
export async function courseByCourseNumber(courseNumber) {
  const response = await axios.get(
    `${backendURL}/${apiNames.course.COURSE}/${courseNumber}`
  );
  return response.data;
}

export async function sectionsByCourseNumber(courseNumber) {
  const response = await axios.get(
    `${backendURL}/${apiNames.course.COURSE}/${courseNumber}/${apiNames.course.SECTIONS}`
  );
  return response.data;
}

export async function courseSearch(courseName) {
  const response = await axios.get(
    `${backendURL}/${apiNames.course.COURSE}/${courseName}/${apiNames.course.SEARCH}`
  );
  return response.data;
}

export async function getAllCourses() {
  const response = await axios.get(`${backendURL}/${apiNames.course.SEARCH}`);
  return response.data;
}

// subject query
export async function getAllSubjects() {
  const response = await axios.get(`${backendURL}/${apiNames.subject.EXPLORE}`);
  return response.data;
}

export async function subjectBySubjectCode(subjectCode) {
  const response = await axios.get(
    `${backendURL}/${apiNames.subject.EXPLORE}/${subjectCode}`
  );
  return response.data;
}

export async function coursesBySubjectCode(subjectCode) {
  const response = await axios.get(
    `${backendURL}/${apiNames.subject.EXPLORE}/${subjectCode}/${apiNames.subject.COURSES}`
  );
  return response.data;
}

export async function subjectSearch(subjectCode) {
  const response = await axios.get(
    `${backendURL}/${apiNames.subject.EXPLORE}/${subjectCode}/${apiNames.subject.SEARCH}`
  );
  return response.data;
}

export async function subjectCourseSearch(subjectCode, courseName) {
  const response = await axios.get(
    `${backendURL}/${apiNames.subject.EXPLORE}/${subjectCode}/${apiNames.course.COURSE}/${courseName}/${apiNames.subject.SEARCH}`
  );
  return response.data;
}

// how to call API
// function(param).then((data) => {
//     do something with data;
//   });
