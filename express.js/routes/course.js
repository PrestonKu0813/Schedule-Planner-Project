const express = require("express");
const MysqlConn = require("../mysql_query/mysql_conn");
const router = express.Router();

const mysqlConn = MysqlConn.getInstance();
const knex = mysqlConn.getDB;

router.get("/:course_number", (req, res) => {
  const course_number = req.params.course_number;
});

router.get("/:course_number/sections", (req, res) => {
  const course_number = req.params.course_number;
});

module.exports = router;
