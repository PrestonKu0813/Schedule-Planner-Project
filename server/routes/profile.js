const router = require("express").Router();
const auth = require("../enums/auth_profile");
const { saveSchedule } = require("../database/query");

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

router.patch("/save/:id", async (req, res) => {
  const { id } = req.params;
  const { scheduleName: key, scheduleIndices: value } = req.body;

  try {
    const result = await saveSchedule(id, key, value);
    res.send(result); //send "success", database_names.message.success
  } catch (err) {
    console.error(err.stack);
    res.status(err.status || 500).json({
      status: 0,
      error_message: err.message || "Internal Server Error",
    });
  }
});

module.exports = router;
