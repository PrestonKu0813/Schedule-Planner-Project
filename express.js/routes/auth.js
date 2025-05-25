const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req, res) => {
  const loginError = req.query.error;
  if (req.isAuthenticated()) {
    res.redirect("/profile");
  } else {
    res.redirect("/auth/google");
  }
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login?error=login_failed", // include failed message
  }),
  (req, res) => {
    res.redirect("/profile");
  }
);

router.get("/logout", (req, res, next) => {
  // logout of passport
  req.logout((err) => {
    if (err) return next(err);

    // destroy the session
    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid"); // clear the session cookie
      res.redirect("/");
    });
  });
});

module.exports = router;
