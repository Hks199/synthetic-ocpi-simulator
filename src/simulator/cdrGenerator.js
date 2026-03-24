const sessions = require("../database/sessions");
const cdrs = require("../database/cdrs");
const stations = require("../database/stations");
const tariffs = require("../database/tariffs");

const { pushSession, pushCDR } = require("../utils/ocpiClient");

/**
 * 🔍 Get Tariff ID
 */
function getTariffId(session) {

    for (const location of stations) {

        if (location.id !== session.location_id) continue;

        for (const evse of location.evses) {

            if (
                evse.evse_id === session.evse_id ||
                evse.uid === session.evse_id
            ) {

                const connector = evse.connectors?.find(
                    c => c.id === session.connector_id
                );

                return connector?.tariff_ids?.[0] || null;
            }
        }
    }

    return null;
}

/**
 * 💰 Get Tariff
 */
function getTariff(tariff_id) {
    return tariffs.find(t => t.id === tariff_id) || null;
}

/**
 * 💸 Calculate Cost
 */
function calculateCost(session, tariff) {

    if (!tariff) return 0;

    let totalCost = 0;

    for (const element of tariff.elements || []) {
        for (const component of element.price_components || []) {

            switch (component.type) {

                case "ENERGY":
                    totalCost += (session.kwh || 0) * component.price;
                    break;

                case "TIME":
                    const minutes =
                        (new Date(session.end_date_time) - new Date(session.start_date_time)) / 60000;

                    totalCost += minutes * component.price;
                    break;

                case "FLAT":
                    totalCost += component.price;
                    break;
            }
        }
    }

    return Number(totalCost.toFixed(2));
}

/**
 * 🧾 STOP SESSION
 */
async function stopSession(session_id, EMSP_URL) {

    const session = sessions.find(s => s.id === session_id);
    if (!session) throw new Error("Session not found");

    console.log("🛑 Stopping session:", session.id);

    // ⛔ Stop interval
    if (session.interval) {
        clearInterval(session.interval);
        delete session.interval;
    }

    session.status = "COMPLETED";
    session.end_date_time = new Date();
    session.last_updated = new Date();

    // ✅ push final session
    const finalSessionPayload = {
        id: session.id,
        country_code: "IN",
        party_id: "CPO",
        start_date_time: session.start_date_time,
        end_date_time: session.end_date_time,
        kwh: Number(session.kwh.toFixed(3)),
        status: "COMPLETED",
        last_updated: new Date()
    };

    await pushSession(finalSessionPayload, EMSP_URL);

    const tariff_id = getTariffId(session);
    const tariff = getTariff(tariff_id);

    const total_cost = calculateCost(session, tariff);

    const durationMs =
        new Date(session.end_date_time) - new Date(session.start_date_time);

    const cdr = {
        id: "CDR_" + session.id,
        session_id: session.id,

        country_code: "IN",
        party_id: "CPO",

        start_date_time: session.start_date_time,
        end_date_time: session.end_date_time,

        cdr_token: {
            uid: session.token_uid,
            type: "RFID",
            contract_id: "CONTRACT-001"
        },

        auth_method: "AUTH_REQUEST",
        authorization_reference: session.transaction_id,

        cdr_location: {
            id: session.location_id,
            evse_uid: session.evse_id,
            connector_id: session.connector_id
        },

        charging_periods: [
            {
                start_date_time: session.start_date_time,
                dimensions: [
                    {
                        type: "ENERGY",
                        volume: Number(session.kwh.toFixed(3))
                    },
                    {
                        type: "TIME",
                        volume: Number((durationMs / 3600000).toFixed(4))
                    }
                ]
            }
        ],

        total_energy: Number(session.kwh.toFixed(3)),
        total_time: Number((durationMs / 3600000).toFixed(4)),

        total_cost: {
            excl_vat: total_cost,
            incl_vat: total_cost
        },

        currency: tariff?.currency || "INR",
        tariff_id: tariff_id,

        last_updated: new Date()
    };

    cdrs.push(cdr);

    await pushCDR(cdr, EMSP_URL);

    console.log("✅ CDR Generated:", cdr);

    return cdr;
}

module.exports = { stopSession };