const { v4: uuid } = require("uuid");
const sessions = require("../database/sessions");
const { pushSession } = require("../utils/ocpiClient");

const stations = require("../database/stations");
const tariffs = require("../database/tariffs");

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
 * 💸 Calculate Cost (LIVE)
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
                        (new Date() - new Date(session.start_date_time)) / 60000;

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
 * 🧾 Build OCPI Session Payload
 */
function buildSessionPayload(session) {

    const durationMs =
        new Date() - new Date(session.start_date_time);

    const tariff_id = getTariffId(session);
    const tariff = getTariff(tariff_id);

    const total_cost_value = calculateCost(session, tariff);

    return {
        id: session.id,

        country_code: "IN",
        party_id: "CPO",

        start_date_time: session.start_date_time,
        end_date_time: new Date(),

        kwh: Number(session.kwh.toFixed(3)),

        auth_method: "AUTH_REQUEST",
        authorization_reference: session.transaction_id,

        location_id: session.location_id,
        evse_uid: session.evse_id,
        connector_id: session.connector_id,

        currency: tariff?.currency || "INR",
        status: session.status,

        last_updated: new Date(),

        cdr_token: {
            uid: session.token_uid,
            type: "RFID",
            contract_id: "CONTRACT-001"
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

        // ✅ REAL COST
        total_cost: {
            excl_vat: total_cost_value,
            incl_vat: total_cost_value
        },

        tariff_id: tariff_id || null
    };
}

/**
 * 🚀 START SESSION
 */
function startSession(data, EMSP_URL) {

    console.log("🚀 Incoming START_SESSION data:", data);

    const session = {
        id: uuid(),

        country_code: "IN",
        party_id: "CPO",

        location_id: data.location_id,
        evse_id: data.evse_uid,
        connector_id: data.connector_id,

        token_uid: data.token_uid,
        transaction_id: data.transaction_id,

        kwh: 0,
        status: "ACTIVE",

        start_date_time: new Date(),
        last_updated: new Date()
    };

    // ⚡ Charging simulation
    const interval = setInterval(async () => {

        session.kwh += Math.random() * 1;
        session.last_updated = new Date();

        console.log(`⚡ Charging ${session.id}: ${session.kwh.toFixed(2)} kWh`);

        const payload = buildSessionPayload(session);

        await pushSession(payload, EMSP_URL);

        console.log("📡 Session pushed to Adaptor");

    }, 20000);

    session.interval = interval;

    sessions.push(session);

    console.log("✅ Session Created:", session.id);

    return session;
}

module.exports = { startSession };