const router = require("express").Router();
const {
  courseByCourseNumber,
  sectionsByCourseNumber,
  courseSearch,
} = require("../database/query");

router.get("/:course_number", async (req, res) => {
  const courseNumber = req.params.course_number;
  try {
    const courses = await courseByCourseNumber(courseNumber);
    res.json(courses);
  } catch (err) {
    // err instance of
    if (res.statusCode == 400) {
      res.json({
        status: 400,
        error_message: "invalid request",
      });
    }
  }
});

router.get("/:course_number/sections", async (req, res) => {
  const courseNumber = req.params.course_number;
  try {
    const sections = await sectionsByCourseNumber(courseNumber);
    res.json(sections);
  } catch (err) {
    if (res.statusCode == 400) {
      res.json({
        status: 400,
        error_message: "invalid request",
      });
    }
  }
});

router.get("/:course_name/search", async (req, res) => {
  const courseName = req.params.course_name;
  try {
    const courses = await courseSearch(courseName);
    res.json(courses);
  } catch (err) {
    if (res.statusCode == 400) {
      res.json({
        status: 400,
        error_message: "invalid request",
      });
    }
  }
});

module.exports = router;
