const router = require("express").Router();
const {
  getAllSubjects,
  subjectBySubjectCode,
  coursesBySubjectCode,
  subjectSearch,
} = require("../database/query");

router.get("/", async (req, res) => {
  try {
    const subjectsObject = await getAllSubjects();
    res.status(200).json(subjectsObject);
  } catch (err) {
    console.error(err.stack);
    res.status(err.status || 500).json({
      status: 0,
      error_message: err.message || "Internal Server Error",
    });
  }
});

router.get("/:subject_code", async (req, res) => {
  const subjectCode = req.params.subject_code;
  try {
    const subject = await subjectBySubjectCode(subjectCode);
    res.status(200).json(subject);
  } catch (err) {
    console.error(err.stack);
    res.status(err.status || 500).json({
      status: 0,
      error_message: err.message || "Internal Server Error",
    });
  }
});

router.get("/:subject_code/courses", async (req, res) => {
  const subjectCode = req.params.subject_code;
  try {
    const courses = await coursesBySubjectCode(subjectCode);
    res.status(200).json(courses);
  } catch (err) {
    console.error(err.stack);
    res.status(err.status || 500).json({
      status: 0,
      error_message: err.message || "Internal Server Error",
    });
  }
});

router.get("/:subject_code/search", async (req, res) => {
  const subjectCode = req.params.subject_code;
  try {
    const courses = await subjectSearch(subjectCode);
    res.status(200).json(courses);
  } catch (err) {
    console.error(err.stack);
    res.status(err.status || 500).json({
      status: 0,
      error_message: err.message || "Internal Server Error",
    });
  }
});

module.exports = router;
