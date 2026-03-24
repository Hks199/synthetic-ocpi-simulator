const express = require("express");
const router = express.Router();

const tokensDB = require("../database/tokens");

/**
 * 🔌 OCPI CPO Endpoint
 * EMSP → CPO (Adaptor → Simulator)
 */
router.put('/ocpi/2.2.1/tokens/:country_code/:party_id/:uid', (req, res) => {

    const { country_code, party_id, uid } = req.params;
    const token = req.body;

    console.log("📥 Received Token from Adaptor:", {
        country_code,
        party_id,
        uid,
        token
    });

    // 🔄 Upsert in local DB
    const existing = tokensDB.find(t => t.uid === uid);

    if (existing) {
        Object.assign(existing, token);
        console.log("♻️ Token Updated:", uid);
    } else {
        tokensDB.push({
            ...token,
            uid,
            country_code,
            party_id
        });
        console.log("🆕 Token Created:", uid);
    }

    return res.json({
        status_code: 1000,
        status_message: "Token received successfully",
        data: {}
    });
});

module.exports = router;