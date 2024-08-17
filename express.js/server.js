const { courseByCourseNumber } = require("./mysql_query/query");

const express = require("express");
const app = express();
port = 3000;

// swagger api ui
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// explore route
const exploreRouter = require("./routes/explore");
app.use("/explore", exploreRouter);

// course route
const courseRouter = require("./routes/course");
app.use("/course", courseRouter);

// run server
app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
