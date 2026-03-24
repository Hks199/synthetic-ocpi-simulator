const express = require("express");
const app = express();

app.use(express.json());

const versions = require("./ocpi/versions");
const { router: credentials } = require("./ocpi/credentials");
const locations = require("./ocpi/locations");
const commands = require("./ocpi/commands");
const versionDetails = require("./ocpi/versionDetails");
const sessionsApi = require("./ocpi/sessions");
const cdrsApi = require("./ocpi/cdrs");
const tariffsApi = require("./ocpi/tariffs");
const tokensApi = require("./ocpi/tokens");
const cpoTokensReceiver = require("./ocpi/cpoTokensReceiver");

// 🔥 IMPORTANT (CPO role path)
app.use("/", cpoTokensReceiver);
app.use("/ocpi/2.2.1/tokens", tokensApi);

app.use("/ocpi/2.2.1/tariffs", tariffsApi);
app.use("/ocpi/2.2.1/sessions", sessionsApi);
app.use("/ocpi/2.2.1/cdrs", cdrsApi);

app.use("/ocpi/versions", versions);
app.use("/ocpi/2.2.1/credentials", credentials);
app.use("/ocpi/2.2.1/locations", locations);
app.use("/ocpi/2.2.1/commands", commands);
app.use("/ocpi/2.2.1", versionDetails);

app.listen(6002, () => {
    console.log("🚀 Synthetic OCPI Simulator running on port 6002");
});