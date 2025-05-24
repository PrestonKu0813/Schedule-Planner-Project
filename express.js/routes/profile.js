const router = require("express").Router();
const auth = require("../enums/auth_profile");
const { getGoogleUserBySession } = require("../database/query");

// const authCheck = async (req, res, next) => {
//   // if (!req.user) {
//   //   // if the user is not logged in
//   //   res.redirect("auth/login");
//   // } else {
//   //   next();
//   // }
//   if (!req.session) {
//     // if the user is not logged in
//     res.redirect("/");
//   } else {
//     const user = await getGoogleUserBySession(res.session);
//     res.json(user);
//     next();
//   }
// };

const isLogin = async (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  // Not authenticated – redirect to Google OAuth flow
  res.redirect("/auth/google");
};

router.get("/", isLogin, (req, res) => {
  // res.send("you're logged in, this is your profile " + req.user[auth.NAME]);
  res.render("profile", { user: req.user });
});

module.exports = router;
