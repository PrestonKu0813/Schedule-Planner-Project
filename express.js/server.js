const express = require("express");
require("dotenv").config({ path: `./env/.env.${process.env.ENV}` });
const passportSetup = require("./config/passport_setting");
const cookieSession = require("cookie-session");
const app = express();
port = 3000;

// example
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("example");
});

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

// auth route
const authRouter = require("./routes/auth");
const { config } = require("dotenv");
app.use("/auth", authRouter);

// cookie session
app.use(
  cookieSession({
    maxAge: 60 * 60 * 1000, // an hour
    keys: [process.env.SESSION_KEY],
  })
);

// run server
app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
