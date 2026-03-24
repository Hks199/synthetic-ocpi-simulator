const { pushSession } = require("../utils/ocpiClient");

function simulateEnergy(session, EMSP_URL) {

    // ✅ store interval inside session (but we will remove before response)
    session.interval = setInterval(async () => {

        session.kwh += 0.5;
        session.last_updated = new Date();

        console.log("⚡ Charging:", session.id, session.kwh);

        // OPTIONAL: push live updates
        await pushSession(session, EMSP_URL);

    }, 5000);
}

module.exports = simulateEnergy;