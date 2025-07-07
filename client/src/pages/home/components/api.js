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

//profile
export async function savedScheudle(userId, scheduleName, scheduleIndices) {
  try {
    const response = await axios.patch(
      `${backendURL}/${apiNames.profile.PROFILE}/${apiNames.profile.SAVED_SCHEDULE}/${userId}`,
      { scheduleName, scheduleIndices },
      { withCredentials: true }
    );
    // console.log(response.data);
  } catch (error) {
    const message =
      error.response?.data || error.message || "Unknown error occurred";
    console.error(message);
    throw new Error(message);
  }
}

export async function getSavedSchedules(userId) {
  try {
    // console.log("🛠️ [getSavedSchedules] Calling API with userId:", userId);
    // console.log("🛠️ [getSavedSchedules] Full URL:", `${backendURL}/${apiNames.profile.PROFILE}/schedules/${userId}`);

    const response = await axios.get(
      `${backendURL}/${apiNames.profile.PROFILE}/schedules/${userId}`,
      { withCredentials: true }
    );

    // console.log("🛠️ [getSavedSchedules] Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("🛠️ [getSavedSchedules] Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    const message =
      error.response?.data || error.message || "Unknown error occurred";
    console.error(message);
    throw new Error(message);
  }
}

export async function loadScheduleByIndices(sectionIndices) {
  try {
    // console.log("🛠️ [loadScheduleByIndices] Calling API with sectionIndices:", sectionIndices);

    const response = await axios.post(
      `${backendURL}/${apiNames.profile.PROFILE}/load-schedule`,
      { sectionIndices },
      { withCredentials: true }
    );

    // console.log("🛠️ [loadScheduleByIndices] Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("🛠️ [loadScheduleByIndices] Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    const message =
      error.response?.data || error.message || "Unknown error occurred";
    console.error(message);
    throw new Error(message);
  }
}

export async function deleteScheudle(userId, scheduleName) {
  try {
    const response = await axios.post(
      `${backendURL}/${apiNames.profile.PROFILE}/${apiNames.profile.DELETE_SCHEDULE}/${userId}`,
      { scheduleName },
      { withCredentials: true }
    );
    console.log(response.data);
  } catch (error) {
    const message =
      error.response?.data || error.message || "Unknown error occurred";
    console.error(message);
    throw new Error(message);
  }
}

// how to call API
// function(param).then((data) => {
//     do something with data;
//   });
