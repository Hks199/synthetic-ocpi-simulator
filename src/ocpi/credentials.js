const express = require("express");
const router = express.Router();

let EMSP_URL = "https://uat-bpp-opci-adaptor.ubc.nbsl.org.in/ocpi/2.2.1";

let CPO_URL = "https://uat-bpp-opci.ubc.nbsl.org.in/ocpi/2.2.1";

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