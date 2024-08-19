// const MysqlConn = require("./mysql_conn");
// const mysqlConn = MysqlConn.getInstance();
// const knex = mysqlConn.getDB;

const db = require("./mysql_conn");

async function courseByCourseNumber(courseNumber) {
  const course = await db
    .table("course")
    .where("course_number", courseNumber)
    .first();
  delete course["subject_code"];
  return course
}

async function sectionsByCourseNumber(courseNumber) {
  const sectionsObject = {};
  const sectionsArray = await db
    .table("section")
    .where("course_number", courseNumber);
  for (let i = 0; i < sectionsArray.length; i++) {
    const index_number = sectionsArray[i]["index_number"];
    lecture_info = JSON.parse(sectionsArray[i]["lecture_info"]);
    sectionsArray[i]["lecture_info"] = lecture_info;
    delete sectionsArray[i]["course_number"];
    sectionsObject[index_number] = sectionsArray[i];
  }
  return sectionsObject;
}

function subjectBysectionCode(subjectCode) {
  return db.table("subject").where("subject_code", subjectCode);
}

module.exports = {
  courseByCourseNumber,
  sectionsByCourseNumber,
  subjectBysectionCode,
};
