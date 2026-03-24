const axios = require("axios");
const crypto = require("crypto");

/**
 * 🔄 PUSH SESSION (FIXED FOR OCPI)
 */
async function pushSession(session, EMSP_URL) {

    if (!EMSP_URL) return;

    try {

        const country_code = session.country_code || "IN";
        const party_id = session.party_id || "CPO";

        // ❌ Remove interval before sending (important)
        const safeSession = { ...session };
        delete safeSession.interval;

        // ✅ MUST match path params
        safeSession.country_code = country_code;
        safeSession.party_id = party_id;

        await axios.put(
            `${EMSP_URL}/sessions/${country_code}/${party_id}/${session.id}`,
            safeSession,
            {
                headers: {
                    Authorization: "Token ubc-token-123",
                    "Content-Type": "application/json",
                    "X-Correlation-Id": crypto.randomUUID(),
                    "X-Request-Id": crypto.randomUUID(),
                },
            }
        );

        console.log("📡 Session pushed to Adaptor");

    } catch (err) {
        console.error(
            "SESSION PUSH ERROR:",
            err?.response?.data || err.message
        );
    }
}

/**
 * 📤 PUSH CDR (Already Correct)
 */
async function pushCDR(cdr, EMSP_URL) {

    if (!EMSP_URL) return;

    try {
        await axios.post(
            `${EMSP_URL}/cdrs`,
            cdr,
            {
                headers: {
                    Authorization: "Token ubc-token-123",
                    "Content-Type": "application/json",
                    "X-Correlation-Id": crypto.randomUUID(),
                    "X-Request-Id": crypto.randomUUID(),
                },
            }
        );

        console.log("📤 CDR pushed to Adaptor");

    } catch (err) {
        console.error(
            "CDR PUSH ERROR:",
            err?.response?.data || err.message
        );
    }
}

module.exports = { pushSession, pushCDR };