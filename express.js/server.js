const express = require("express");
const MysqlConn = require("./mysql_conn");
const app = express();

port = 3000;
app.listen(3000);

const mysqlConn = MysqlConn.getInstance();
const knex = mysqlConn.getDB;
