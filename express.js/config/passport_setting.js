require("dotenv").config({ path: `./env/.env.${process.env.ENV}` });
const auth = require("../enums/auth_profile");
const { isUserExist, insertUser } = require("../database/query");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

passport.use(
  new GoogleStrategy(
    {
      // opotion for the google strategy
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRETE,
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user exists in the db
      isUserExist(profile[auth.ID]).then((currentUser) => {
        console.log(currentUser);
        if (currentUser) {
          // already registered
          console.log("the user is: " + profile[auth.NAME]);
        } else {
          // not yet registered
          insertUser(profile[auth.ID], profile[auth.NAME]).then((newUser) => {
            console.log("new user created: " + newUser);
          });
        }
      });
    }
  )
);
