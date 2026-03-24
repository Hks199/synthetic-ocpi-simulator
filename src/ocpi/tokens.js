const express = require("express");
const router = express.Router();

const tokens = require("../database/tokens");
const { upsertTokenAndSync } = require("../simulator/tokenManager");

/**
 * 🔍 Get all tokens
 */
router.get("/", (req, res) => {
    res.json({
        status_code: 1000,
        data: tokens
    });
});

/**
 * 🔄 Upsert token (like your AdminTokensModule)
 */
router.post("/", async (req, res) => {

    const token = await upsertTokenAndSync(req.body);

    res.json({
        status_code: 1000,
        data: token
    });
});

module.exports = router;