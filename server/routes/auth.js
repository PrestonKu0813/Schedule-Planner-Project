const router = require("express").Router();
const passport = require("passport");
require("dotenv").config({ path: `./env/.env` });

router.get("/login", (req, res) => {
  const loginError = req.query.error;
  if (req.isAuthenticated()) {
    res.redirect(process.env.FRONTEND_URL + "/home");
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
    res.redirect(process.env.FRONTEND_URL + "/home");
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
      res.status(200).json({ message: "Logged out" });
    });
  });
});

module.exports = router;
