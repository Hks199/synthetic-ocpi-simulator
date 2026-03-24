const express = require("express");
const router = express.Router();
const {CPO_URL} = require("./credentials");
router.get("/", (req, res) => {
  res.json({
    status_code: 1000,
    data: {
      version: "2.2.1",
      endpoints: [
        {
          identifier: "credentials",
          role: "RECEIVER",
          url: `${CPO_URL}/credentials`
        },
        {
          identifier: "locations",
          role: "SENDER",
          url: `${CPO_URL}/locations`
        },
        {
          identifier: "sessions",
          role: "SENDER",
          url: `${CPO_URL}/sessions`
        },
        {
          identifier: "cdrs",
          role: "SENDER",
          url: `${CPO_URL}/cdrs`
        },
        {
          identifier: "commands",
          role: "RECEIVER",
          url: `${CPO_URL}/commands`
        },
        {
         identifier: "tariffs",
         role: "SENDER",
         url: `${CPO_URL}/tariffs`
        },
        {
         identifier: "tokens",
         role: "RECEIVER",
         url: `${CPO_URL}/tokens`
        }

      ]
    }
  });
});


module.exports = router;