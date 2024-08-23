const router = require("express").Router();
const {
  courseByCourseNumber,
  sectionsByCourseNumber,
} = require("../database/query");

router.get("/:course_number", async (req, res) => {
  const course_number = req.params.course_number;
  try {
    const courses = await courseByCourseNumber(course_number);
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

router.get("/:course_number/sections", async (req, res) => {
  const course_number = req.params.course_number;
  try {
    const sections = await sectionsByCourseNumber(course_number);
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

module.exports = router;
