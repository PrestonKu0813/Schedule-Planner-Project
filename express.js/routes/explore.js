const express = require("express");
const MysqlConn = require("../mysql_query/mysql_conn");
const router = express.Router();

const mysqlConn = MysqlConn.getInstance();
const knex = mysqlConn.getDB;

router.get("/", (req, res) => {
  res.send("hello world");
});

router.get("/:subject_code", (req, res) => {
  const subjectCode = req.params.subject_code;
});

router.get("/:subject_code/courses", (req, res) => {
  const subjectCode = req.params.subject_code;
});

module.exports = router;
