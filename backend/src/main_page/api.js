import axios from "axios";
import apiNames from "./enums/api_names";
const baseURL = "http://localhost:3000";

// course api
export async function courseByCourseNumber(courseNumber) {
  const response = await axios.get(
    `${baseURL}/${apiNames.course.COURSE}/${courseNumber}`
  );
  return response.data;
}

export async function sectionsByCourseNumber(courseNumber) {
  const response = await axios.get(
    `${baseURL}/${apiNames.course.COURSE}/${courseNumber}/${apiNames.course.SECTIONS}`
  );
  return response.data;
}

export async function courseSearch(courseNumber) {
  const response = await axios.get(
    `${baseURL}/${apiNames.course.COURSE}/${courseNumber}/${apiNames.course.SEARCH}`
  );
  return response.data;
}

// subject query
export async function getAllSubjects() {
  const response = await axios.get(`${baseURL}/${apiNames.subject.EXPLORE}`);
  return response.data;
}

export async function subjectBySubjectCode(subjectCode) {
  const response = await axios.get(
    `${baseURL}/${apiNames.subject.EXPLORE}/${subjectCode}`
  );
  return response.data;
}

export async function coursesBySubjectCode(subjectCode) {
  const response = await axios.get(
    `${baseURL}/${apiNames.subject.EXPLORE}/${subjectCode}/${apiNames.subject.COURSES}`
  );
  return response.data;
}

// how to call API
// function(param).then((data) => {
//     do something with data;
//   });
