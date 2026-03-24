const express = require("express");
const router = express.Router();
const sessions = require("../database/sessions");

router.get("/", (req, res) => {
  res.json({
    status_code: 1000,
    data: sessions
  });
});

module.exports = router;