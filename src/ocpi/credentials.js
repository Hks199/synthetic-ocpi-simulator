const express = require("express");
const router = express.Router();

let EMSP_URL = "http://localhost:6003/ocpi/2.2.1";

let CPO_URL = "http://localhost:6002/ocpi/2.2.1/";

router.post("/", (req, res) => {
    EMSP_URL = req.body.url;
    res.json({ status_code: 1000, data: { token: "CPO_TOKEN_123" } });
});

module.exports = {
    router,
    EMSP_URL,
    CPO_URL,
    getEMSPUrl: () => EMSP_URL
};