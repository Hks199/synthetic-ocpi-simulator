const express = require("express");
const router = express.Router();
const stations = require("../database/stations");

router.get("/", (req, res) => {
  res.json({ status_code: 1000, data: stations });
});

module.exports = router;
