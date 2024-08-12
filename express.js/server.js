const express = require("express");
const MysqlConn = require("./mysql_conn");
const app = express();

port = 3000;
app.listen(port);

const mysqlConn = MysqlConn.getInstance();
const knex = mysqlConn.getDB;
