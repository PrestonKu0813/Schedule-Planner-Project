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
    const index_number = sectionsArray[i][database_names.section.INDEX];
    lecture_info = JSON.parse(sectionsArray[i][database_names.section.INFO]);
    sectionsArray[i][database_names.section.INFO] = lecture_info;
    delete sectionsArray[i][database_names.course.NUMBER];
    sectionsObject[index_number] = sectionsArray[i];
  }
  return sectionsObject;
}

// subject query
function subjectBysectionCode(subjectCode) {
  return db
    .table(database_names.table.SUBJECT)
    .where(database_names.subject.CODE, subjectCode);
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
  return await db.table(database_names.table.USER).insert(
    {
      google_id: userId,
      user_name: userName,
    },
    userId
  );
}

module.exports = {
  courseByCourseNumber,
  sectionsByCourseNumber,
  subjectBysectionCode,
  isUserExist,
  insertUser,
};
