const express = require("express");
const router = express.Router();
const cdrs = require("../database/cdrs");

router.get("/", (req, res) => {
  res.json({
    status_code: 1000,
    data: cdrs
  });
});

module.exports = router;