const MysqlConn = require("./mysql_conn");
const mysqlConn = MysqlConn.getInstance();
const knex = mysqlConn.getDB;

function courseByCourseNumber(courseNumber) {
    
}

module.exports = {
  courseByCourseNumber,
};
