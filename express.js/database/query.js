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

// user query
async function isUserExist(googleId) {
  const idArray = await db
    .table(database_names.table.USER)
    .select(database_names.user.GOOGLE_ID)
    .where(database_names.user.GOOGLE_ID, googleId);

  if (idArray.length > 0) {
    return true;
  }
  return false;
}

async function insertUser(googleId, userName) {
  const data = {};
  data[database_names.user.ID] = uuidv4();
  data[database_names.user.GOOGLE_ID] = googleId;
  data[database_names.user.NAME] = userName;

  await db.insert(data).into(database_names.table.USER);
}

async function getUserByGoogle(googleId) {
  return await db
    .table(database_names.table.USER)
    .where(database_names.user.GOOGLE_ID, googleId)
    .first();
}

async function getUserById(userId) {
  return await db
    .table(database_names.table.USER)
    .where(database_names.user.ID, userId)
    .first();
}

module.exports = {
  courseByCourseNumber,
  sectionsByCourseNumber,
  getAllSubjects,
  subjectBySubjectCode,
  coursesBySubjectCode,
  isUserExist,
  getUserByGoogle,
  getUserById,
  insertUser,
};
