// const MysqlConn = require("./mysql_conn");
// const mysqlConn = MysqlConn.getInstance();
// const knex = mysqlConn.getDB;

const db = require("./mysql_conn");

function courseByCourseNumber(courseNumber) {
  return db.table("course").where("course_number", courseNumber).first();
}

function sectionsByCourseNumber(courseNumber) {
  return db.table("section").where("course_number", courseNumber);
}

module.exports = {
  courseByCourseNumber,
  sectionsByCourseNumber,
};
