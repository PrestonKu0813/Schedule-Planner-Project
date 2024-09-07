const router = require("express").Router();


router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res, next) => {
  res.clearCookie("connect.sid"); // clear the session cookie
  // logout of passport
  req.logout((err) => {
    // destroy the session
    req.session.destroy(function (err) {
      res.redirect("/");
    });
  });
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

module.exports = router;
