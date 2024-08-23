require("dotenv").config({ path: `./env/.env.${process.env.ENV}` });
const auth = require("../enums/auth_profile");
const database_names = require("../enums/database_names");
const {
  isUserExist,
  insertUser,
  getUserById,
  getUserByGoogle,
} = require("../database/query");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user, done) => {
  const id = database_names.user.ID;
  console.log("comfirm " + user[id]);
  done(null, user[id]);
});

passport.deserializeUser((id, done) => {
  console.log(id);
  getUserById(id).then((user) => {
    console.log(user);
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // opotion for the google strategy
      callbackURL: `${process.env.BASE_URL}${process.env.GOOGLE_OAUTH_CALLBACK_URL}`,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    function (accessToken, refreshToken, profile, done) {
      // check if user exists in the db
      isUserExist(profile[auth.ID]).then((currentUser) => {
        if (currentUser) {
          // already registered
          console.log(currentUser);
          getUserByGoogle(profile[auth.ID]).then((user) => {
            console.log(user);
            done(null, user);
          });
        } else {
          // not yet registered
          console.log(currentUser);
          insertUser(profile[auth.ID], profile[auth.NAME]).then(function () {
            isUserExist(profile[auth.ID]).then((newUser) => {
              if (newUser) {
                console.log("successful registration");
                getUserByGoogle(profile[auth.ID]).then((user) => {
                  console.log(user);
                  done(null, user);
                });
              } else {
                console.log("unsuccessful registration");
              }
            });
          });
        }
      });
    }
  )
);
