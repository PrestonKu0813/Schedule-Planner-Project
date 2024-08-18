const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello world");
});

router.get("/:subject_code", (req, res) => {
  const subjectCode = req.params.subject_code;
});

router.get("/:subject_code/courses", (req, res) => {
  const subjectCode = req.params.subject_code;
});

module.exports = router;
