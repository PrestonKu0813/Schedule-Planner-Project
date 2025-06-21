// const MysqlConn = require("./mysql_conn");
// const mysqlConn = MysqlConn.getInstance();
// const knex = mysqlConn.getDB;

const db = require("./mysql_conn");
const database_names = require("../enums/database_names");
const { v4: uuidv4 } = require("uuid");

// course query
async function courseByCourseNumber(courseNumber) {
  const course = await db
    .table(database_names.table.COURSE)
    .where(database_names.course.NUMBER, courseNumber)
    .first();
  delete course[database_names.subject.CODE];
  return course;
}

async function sectionsByCourseNumber(courseNumber) {
  const sectionsObject = {};
  const sectionsArray = await db
    .table(database_names.table.SECTION)
    .where(database_names.course.NUMBER, courseNumber);

  for (let i = 0; i < sectionsArray.length; i++) {
    const indexNumber = sectionsArray[i][database_names.section.INDEX];
    const lectureInfo = JSON.parse(
      sectionsArray[i][database_names.section.INFO]
    );
    sectionsArray[i][database_names.section.INFO] = lectureInfo;
    delete sectionsArray[i][database_names.course.NUMBER];
    sectionsObject[indexNumber] = sectionsArray[i];
  }
  return sectionsObject;
}

async function courseSearch(courseName) {
  const coursesObject = {};
  const upperCaseCourseName = courseName.toUpperCase();

  const coursesArray = await db
    .table(database_names.table.COURSE)
    .whereILike(database_names.course.NAME, `%${upperCaseCourseName}%`);

  if (coursesArray.length === 0) {
    return { message: "no result" };
  }

  for (let i = 0; i < coursesArray.length; i++) {
    courseNumber = coursesArray[i][database_names.course.NUMBER];
    delete coursesArray[i][database_names.subject.CODE];
    const sectionObject = await sectionsByCourseNumber(courseNumber);
    coursesObject[courseNumber] = coursesArray[i];
    coursesObject[courseNumber].sections = sectionObject;
  }

  return coursesObject;
}

// subject query
async function getAllSubjects() {
  const subjectsObject = {};

  const subjectArray = await db.table(database_names.table.SUBJECT).select("*");
  const coursesArray = await db.table(database_names.table.COURSE).select("*");
  const subjectCoursesColumn = "courses";

  for (let i = 0; i < subjectArray.length; i++) {
    const subjectCode = subjectArray[i][database_names.subject.CODE];
    subjectsObject[subjectCode] = subjectArray[i];
    subjectsObject[subjectCode][subjectCoursesColumn] = {};
  }

  for (let i = 0; i < coursesArray.length; i++) {
    const subjectCode = coursesArray[i][database_names.subject.CODE];
    const courseNumber = coursesArray[i][database_names.course.NUMBER];
    delete coursesArray[i][database_names.subject.CODE];
    subjectsObject[subjectCode][subjectCoursesColumn][courseNumber] =
      coursesArray[i];
  }

  return subjectsObject;
}

async function subjectBySubjectCode(subjectCode) {
  return await db
    .table(database_names.table.SUBJECT)
    .where(database_names.subject.CODE, subjectCode)
    .first();
}

async function coursesBySubjectCode(subjectCode) {
  const coursesObject = {};
  coursesArray = await db
    .table(database_names.table.COURSE)
    .where(database_names.subject.CODE, subjectCode);

  for (let i = 0; i < coursesArray.length; i++) {
    courseNumber = coursesArray[i][database_names.course.NUMBER];
    delete coursesArray[i][database_names.subject.CODE];
    coursesObject[courseNumber] = coursesArray[i];
  }
  return coursesObject;
}

async function subjectSearch(subjectCode) {
  const coursesObject = {};
  coursesArray = await db
    .table(database_names.table.COURSE)
    .where(database_names.subject.CODE, subjectCode);

  for (let i = 0; i < coursesArray.length; i++) {
    courseNumber = coursesArray[i][database_names.course.NUMBER];
    delete coursesArray[i][database_names.subject.CODE];
    const sectionObject = await sectionsByCourseNumber(courseNumber);
    coursesObject[courseNumber] = coursesArray[i];
    coursesObject[courseNumber].sections = sectionObject;
  }
  return coursesObject;
}

async function subjectCourseSearch(subjectCode, courseName) {
  const coursesObject = {};
  const upperCaseCourseName = courseName.toUpperCase();

  coursesArray = await db
    .table(database_names.table.COURSE)
    .where(database_names.subject.CODE, subjectCode)
    .whereILike(database_names.course.NAME, `%${upperCaseCourseName}%`);

  if (coursesArray.length === 0) {
    return { message: "no result" };
  }

  for (let i = 0; i < coursesArray.length; i++) {
    courseNumber = coursesArray[i][database_names.course.NUMBER];
    delete coursesArray[i][database_names.subject.CODE];
    const sectionObject = await sectionsByCourseNumber(courseNumber);
    coursesObject[courseNumber] = coursesArray[i];
    coursesObject[courseNumber].sections = sectionObject;
  }

  return coursesObject;
}

// google user query
async function isGoogleUserExist(googleId) {
  const idArray = await db
    .table(database_names.table.USER.GOOGLE)
    .select(database_names.user.GOOGLE.GOOGLE_ID)
    .where(database_names.user.GOOGLE.GOOGLE_ID, googleId);

  if (idArray.length > 0) {
    return true;
  }
  return false;
}

async function insertGoogleUser(googleId, userName) {
  const data = {};
  data[database_names.user.GOOGLE.ID] = uuidv4();
  data[database_names.user.GOOGLE.GOOGLE_ID] = googleId;
  data[database_names.user.GOOGLE.NAME] = userName;

  await db.insert(data).into(database_names.table.USER.GOOGLE);
}

async function getGoogleUserByGoogle(googleId) {
  return await db
    .table(database_names.table.USER.GOOGLE)
    .where(database_names.user.GOOGLE.GOOGLE_ID, googleId)
    .first();
}

async function getGoogleUserById(userId) {
  return await db
    .table(database_names.table.USER.GOOGLE)
    .where(database_names.user.GOOGLE.ID, userId)
    .first();
}

async function getGoogleUserBySession(session) {
  return await db
    .table(database_names.table.USER.GOOGLE)
    .where(database_names.user.GOOGLE.SESSION, session)
    .first();
}

// main user query
async function insertMainUser(name, password) {
  // use express-validator
  const data = {};
  data[database_names.user.MAIN.ID] = uuidv4();
  data[database_names.user.MAIN.NAME] = name;
  data[database_names.user.MAIN.PASSWORD] = password;
  await db.insert(data).into(database_names.table.USER.MAIN);
}

async function getMainUserBySession(session) {
  return await db
    .table(database_names.table.USER.GOOGLE)
    .where(database_names.user.GOOGLE.SESSION, session)
    .first();
}

module.exports = {
  // course
  courseByCourseNumber,
  sectionsByCourseNumber,
  courseSearch,
  // subject
  getAllSubjects,
  subjectBySubjectCode,
  coursesBySubjectCode,
  subjectSearch,
  subjectCourseSearch,
  // google users
  isGoogleUserExist,
  getGoogleUserByGoogle,
  getGoogleUserById,
  insertGoogleUser,
  getGoogleUserBySession,
  // main users
  insertMainUser,
  getMainUserBySession,
};
