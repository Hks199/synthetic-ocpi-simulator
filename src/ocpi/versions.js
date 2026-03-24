const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status_code: 1000,
    data: [{ version: "2.2.1", url: "http://localhost:6002/ocpi/2.2.1" }]
  });
});

module.exports = router;