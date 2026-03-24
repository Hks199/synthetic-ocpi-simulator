const express = require("express");
const router = express.Router();

const tariffs = require("../database/tariffs");

router.get("/", (req, res) => {
  res.json({
    status_code: 1000,
    data: tariffs
  });
});

module.exports = router;