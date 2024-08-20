// const MysqlConn = require("./mysql_conn");
// const mysqlConn = MysqlConn.getInstance();
// const knex = mysqlConn.getDB;

const db = require("./mysql_conn");
const database_names = require("../enums/database_names");

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
  // const coursesArray = await db
  //   .table("subject")
  //   .innerJoin(
  //     "course",
  //     `subject.${database_names.subject.CODE}`,
  //     `course.${database_names.subject.CODE}`
  //   )
  //   .orderBy(`subject.${database_names.subject.CODE}`, "asc");

  // for (let i = 0; i < coursesArray.length; i++) {
  //   const course = coursesArray[i];

  //   if (!(course[database_names.subject.CODE] in subjectsObject)) {
  //     const currentSubject = {};
  //     currentSubject[database_names.subject.CODE] =
  //       course[database_names.subject.CODE];
  //     currentSubject[database_names.subject.NAME] =
  //       course[database_names.subject.NAME];
  //     currentSubject["courses"] = {};
  //     subjectsObject[course[database_names.subject.CODE]] = currentSubject;
  //   }

  //   const courseObject = {};
  //   courseObject[database_names.course.NUMBER] =
  //     course[database_names.course.NUMBER];
  //   courseObject[database_names.course.NAME] =
  //     course[database_names.course.NAME];
  //   courseObject[database_names.course.CREDIT] =
  //     course[database_names.course.CREDIT];
  //   courseObject[database_names.course.CORE_CODE] =
  //     course[database_names.course.CORE_CODE];

  //   subjectsObject[course[database_names.subject.CODE]][
  //     course[database_names.course.NUMBER]
  //   ] = courseObject;
  // }

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
    // .table(database_names.table.SUBJECT)
    // .innerJoin(
    //   "course",
    //   `subject.${database_names.subject.CODE}`,
    //   `course.${database_names.subject.CODE}`
    // )
    // .where(`subject.${database_names.subject.CODE}`, subjectCode)
    // .orderBy(`subject.${database_names.subject.CODE}`, "asc");
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
async function isUserExist(userId) {
  const idArray = await db
    .table(database_names.table.USER)
    .select(database_names.user.GOOGLE_ID)
    .where(database_names.user.GOOGLE_ID, userId);

  if (idArray.length > 0) {
    return true;
  }
  return false;
}

async function insertUser(userId, userName) {
  await db
    .insert({
      google_id: userId,
      user_name: userName,
    })
    .into(database_names.table.USER);
}

module.exports = {
  courseByCourseNumber,
  sectionsByCourseNumber,
  getAllSubjects,
  subjectBySubjectCode,
  coursesBySubjectCode,
  isUserExist,
  insertUser,
};
