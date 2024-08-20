require("dotenv").config({ path: `./env/.env.${process.env.ENV}` });
const auth = require("../enums/auth_profile");
const { isUserExist, insertUser } = require("../database/query");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      // opotion for the google strategy
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user exists in the db
      isUserExist(profile[auth.ID]).then((currentUser) => {
        console.log(currentUser);
        if (currentUser) {
          // already registered
          console.log("the user is: " + profile[auth.NAME]);
          done(null, profile[auth.NAME]);
        } else {
          // not yet registered
          insertUser(profile[auth.ID], profile[auth.NAME]).then(function () {
            if (isUserExist(profile[auth.ID])) {
              console.log("successful registration");
              done(null, profile[auth.NAME]);
            } else {
              console.log("unsuccessful registration");
            }
          });
        }
      });
    }
  )
);
