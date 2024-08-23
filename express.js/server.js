const express = require("express");
const passport = require("passport");
require("dotenv").config({ path: `./env/.env.${process.env.ENV}` });
require("./config/passport_setup");
const { ConnectSessionKnexStore } = require("connect-session-knex");
const db = require("./database/mysql_conn");
const session = require("express-session");

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

// cookie session
// app.use(
//   cookieSession({
//     maxAge: 60 * 60 * 1000, // an hour
//     keys: [process.env.SESSION_COOKIE_KEY],
//   })
// );

const connectSessionKnexStore = new ConnectSessionKnexStore({
  knex: db,
  clearInterval: 0,
  createTable: true,
  tableName: "sessions",
});

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: [process.env.SESSION_COOKIE_KEY],
    cookie: {
      maxAge: 60 * 60 * 1000, // an hour
      secure: false, // for http not https
    },
    store: connectSessionKnexStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

// profile route
const profileRouter = require("./routes/profile");
app.use("/profile", profileRouter);

// run server
app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
