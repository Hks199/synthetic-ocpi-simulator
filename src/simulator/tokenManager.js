const tokens = require("../database/tokens");
const axios = require("axios");
const { getEMSPUrl } = require("../ocpi/credentials");

/**
 * 🔄 Upsert Token + Sync with CPO (Adaptor)
 */
async function upsertTokenAndSync(tokenData) {

    const existing = tokens.find(t => t.uid === tokenData.uid);

    if (existing) {
        Object.assign(existing, tokenData);
    } else {
        tokens.push(tokenData);
    }

    const EMSP_URL = getEMSPUrl();

    if (EMSP_URL) {
        try {
            // 🔥 Push token to adaptor
            await axios.put(`${EMSP_URL}/tokens/${tokenData.uid}`, tokenData);

            console.log("✅ Token synced with adaptor:", tokenData.uid);
        } catch (err) {
            console.error("❌ Token sync failed");
        }
    }

    return tokenData;
}

module.exports = { upsertTokenAndSync };