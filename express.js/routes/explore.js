const express = require("express");
const MysqlConn = require("../mysql_conn");
const router = express.Router();

const mysqlConn = MysqlConn.getInstance();
const knex = mysqlConn.getDB;

router.get("/:subject_code", (req, res) => {
  const subjectCode = req.params.subject_code;
  knex.select("subject_code").from("subject");
  res.json();
});

module.exports = router;
