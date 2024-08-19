const express = require("express");
const router = express.Router();
const { getAllSubjects, subjectBySectionCode, coursesBySubject } = require("../database/query");

router.get("/", (req, res) => {
  res.send("hello world");
});

router.get("/explore", (req, res) => {
  try {
    const subjectsObject = getAllSubjects();
    res.status(200).json(subjectsObject);
  } catch (err) {
    console.error(err.stack);
    res.status(err.status || 500).json({
      status: 0, 
      error_message: err.message || "Internal Server Error"
    });
  };
})

router.get("/:subject_code", (req, res) => {
  const subjectCode = req.params.subject_code;
  try {
    const subject = subjectBySectionCode(subjectCode);
    res.status(200).json(subject);
  } catch (err) {
    console.error(err.stack);
    res.status(err.status || 500).json({
      status: 0, 
      error_message: err.message || "Internal Server Error"
    });
  };
});

router.get("/:subject_code/courses", (req, res) => {
  const subjectCode = req.params.subject_code;
  try {
    const courses = coursesBySubject(subjectCode);
    res.status(200).json(courses);
  } catch (err) {
    console.error(err.stack);
    res.status(err.status || 500).json({
      status: 0, 
      error_message: err.message || "Internal Server Error"
    });
  };
});

module.exports = router;
