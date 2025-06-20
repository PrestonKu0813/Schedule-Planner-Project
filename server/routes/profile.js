const router = require("express").Router();
const auth = require("../enums/auth_profile");

const authCheck = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // not authenticated -> redirect to login
  res.status(401).json({ message: "Not authenticated" });
};

router.get("/", authCheck, (req, res) => {
  // res.json("success");
  res.json(req.user);
});

module.exports = router;
