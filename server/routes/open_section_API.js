const path = require("path");
const express = require("express");
const router = express.Router();
require("dotenv").config({ path: `./env/.env` });

async function fetchOpenSections(headers = {}) {
  const year = process.env.YEAR
  const term = process.env.SEMESTER // 1 - Spring , 7 - Summer, 9 - Fall, 0 - Winter
  const campus = process.env.CAMPUS // NB - New Brunswick

  const url = `https://classes.rutgers.edu/soc/api/openSections.json?year=${year}&term=${(term)}&campus=${campus}`;

  const res = await fetch(url, { method: "GET", headers });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Upstream fetch failed: ${res.status} ${body}`);
  }

  // API returns JSON array (list of open section indexes)
  const data = await res.json();
  // console.log("Fetched open sections:", data);

  return data
}

router.get("/", async (req, res) => {
  try {
    const openSections = await fetchOpenSections();
    res.json(openSections);
  } catch (err) {
    // Log for server visibility
    console.error(err);

    // You control the response status here; default to 502 for upstream failures
    res.status(502).json({
      status: 502,
      error_message: "Failed to fetch open sections from upstream.",
      detail: process.env.NODE_ENV === "development" ? String(err.message) : undefined,
    });
  }
});

module.exports = router;