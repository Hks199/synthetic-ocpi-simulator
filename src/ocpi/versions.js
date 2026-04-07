const express = require("express");
const router = express.Router();
const {CPO_URL} = require("./credentials");
router.get("/", (req, res) => {
  res.json({
    status_code: 1000,
    data: [{ version: "2.2.1", url: CPO_URL }]
  });
});

module.exports = router;