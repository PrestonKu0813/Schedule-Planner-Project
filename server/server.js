const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./config/passport_setup");
require("dotenv").config({ path: `./env/.env` });
const { ConnectSessionKnexStore } = require("connect-session-knex");
const db = require("./database/mysql_conn");
const cors = require("cors");
const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  credentials: true,
};

const app = express();
const port = 3000;

// frontend api
app.use(cors(corsOptions));

// auth route

const connectSessionKnexStore = new ConnectSessionKnexStore({
  knex: db,
  clearInterval: 0,
  createTable: true,
  tableName: "sessions",
});

app.use(
  session({
    store: connectSessionKnexStore,
    secret: [process.env.SESSION_COOKIE_KEY],
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 * an hour = a day
      secure: false, // for http not https
    },
    store: connectSessionKnexStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// auth route
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

// profile route
const profileRouter = require("./routes/profile");
app.use("/profile", profileRouter);

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
