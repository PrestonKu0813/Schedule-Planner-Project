const express = require("express");
const MysqlConn = require("./mysql_conn");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
port = 3000;

const mysqlConn = MysqlConn.getInstance();
const knex = mysqlConn.getDB;

const exploreRouter = require("./routes/explore");
app.use("/explore", exploreRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
