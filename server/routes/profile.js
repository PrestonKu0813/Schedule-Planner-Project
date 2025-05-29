const router = require("express").Router();
const auth = require("../enums/auth_profile");

const authCheck = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // not authenticated -> redirect to homepage
  res.redirect("/");
};

router.get("/", authCheck, (req, res) => {
  res.render("profile", { user: req.user });
});

module.exports = router;
