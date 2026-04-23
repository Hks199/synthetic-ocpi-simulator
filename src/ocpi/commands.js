const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");

const { startSession } = require("../simulator/sessionManager");
const { stopSession } = require("../simulator/cdrGenerator");
const { getEMSPUrl } = require("./credentials");

/**
 * ✅ Send Command Response to EMSP (response_url)
 */
async function sendCommandResponse(response_url) {
    if (!response_url) {
        console.log("⚠️ No response_url provided");
        return;
    }

    try {
        await axios.post(response_url, {
            result: "ACCEPTED",
            timeout: 30 // 🔥 REQUIRED
        },
         {
             headers: {
                Authorization: "Token ubc-token-123",
                "Content-Type": "application/json",
                "X-Correlation-Id": crypto.randomUUID(),
                "X-Request-Id": crypto.randomUUID(),
            },
        }
    );

        console.log("✅ Command response sent to EMSP");
    } catch (err) {
        console.error(
            "❌ Failed to send command response:",
            err?.response?.data || err.message
        );
    }
}

/**
 * 🚀 START SESSION
 */
router.post("/START_SESSION", async (req, res) => {
    try {
        console.log("📥 START_SESSION received:", req.body);

        const body = req.body; // ✅ FIXED

        const session = startSession(
            {
                location_id: body.location_id,
                evse_uid: body.evse_uid,
                connector_id: body.connector_id,
                token_uid: body.token?.uid,
                transaction_id: body.authorization_reference
            },
            getEMSPUrl()
        );

        console.log("⚡ Session started:", session.id);

        // OCPI requires sending the async command result to the provided response_url.
        await sendCommandResponse(body.response_url);

        return res.json({
            status_code: 1000,
            status_message: "Accepted",
            data: {
                result: "ACCEPTED",
                timeout: 30
            }
        });

    } catch (err) {
        console.error("❌ START_SESSION error:", err);

        return res.status(500).json({
            status_code: 2000,
            status_message: "Error",
            data: {}
        });
    }
});

/**
 * 🛑 STOP SESSION
 */
router.post("/STOP_SESSION", async (req, res) => {
    try {
        console.log("📥 STOP_SESSION received:", req.body);

        const body = req.body;

        const cdr = await stopSession(body.session_id, getEMSPUrl());

        return res.json({
            status_code: 1000,
            status_message: "Session stopped",
            data: cdr
        });

    } catch (err) {
        console.error("❌ STOP_SESSION error:", err);

        return res.status(500).json({
            status_code: 2000,
            status_message: "Error stopping session",
            data: {}
        });
    }
});

module.exports = router;
