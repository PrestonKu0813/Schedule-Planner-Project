const express = require("express");
const {
  courseByCourseNumber,
  sectionsByCourseNumber,
} = require("../database/query");
const router = express.Router();

router.get("/:course_number", async (req, res) => {
  const course_number = req.params.course_number;
  try {
    const courses = await courseByCourseNumber(course_number);
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:course_number/sections", async (req, res) => {
  const course_number = req.params.course_number;
  try {
    const courses = await sectionsByCourseNumber(course_number);
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
