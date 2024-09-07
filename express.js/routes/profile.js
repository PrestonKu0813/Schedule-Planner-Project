const router = require("express").Router();
const auth = require("../enums/auth_profile");

const authCheck = (req, res, next) => {
  if (!req.user) {
    // if the user is not logged in
    res.redirect("auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  // res.send("you're logged in, this is your profile " + req.user[auth.NAME]);
  res.render("profile", {user: req.user});
});

module.exports = router;
