module.exports = [
  {
    country_code: "IN",
    party_id: "CPO",
    id: "LOC1",
    publish: true,
    name: "Station 1 - Hyderabad",
    address: "Hitech City Road",
    city: "Hyderabad",
    state: "Telangana",
    postal_code: "500081",
    country: "IND",
    coordinates: {
      latitude: "17.4435",
      longitude: "78.3772"
    },
    parking_type: "PUBLIC",
    time_zone: "Asia/Kolkata",
    last_updated: new Date(),

    evses: [
      {
        uid: "EVSE1",
        evse_id: "IN*CPO*E1",
        status: "AVAILABLE",
        capabilities: ["REMOTE_START_STOP", "CHARGING_PROFILE_CAPABLE"],
        connectors: [
          {
            id: "C1",
            standard: "IEC_62196_T2",
            format: "SOCKET",
            power_type: "AC_3_PHASE",
            max_voltage: 415,
            max_amperage: 32,
            tariff_ids: ["TARIFF1"],
            last_updated: new Date()
          }
        ],
        last_updated: new Date()
      },

      {
        uid: "EVSE2",
        evse_id: "IN*CPO*E2",
        status: "AVAILABLE",
        capabilities: ["REMOTE_START_STOP"],
        connectors: [
          {
            id: "C2",
            standard: "IEC_62196_T2",
            format: "CABLE",
            power_type: "AC_3_PHASE",
            max_voltage: 415,
            max_amperage: 16,
            tariff_ids: ["TARIFF1"],
            last_updated: new Date()
          }
        ],
        last_updated: new Date()
      }
    ]
  },

  {
    country_code: "IN",
    party_id: "CPO",
    id: "LOC2",
    publish: true,
    name: "Station 2 - Bangalore",
    address: "Whitefield Main Road",
    city: "Bangalore",
    state: "Karnataka",
    postal_code: "560066",
    country: "IND",
    coordinates: {
      latitude: "12.9698",
      longitude: "77.7500"
    },
    parking_type: "PRIVATE",
    time_zone: "Asia/Kolkata",
    last_updated: new Date(),

    evses: [
      {
        uid: "EVSE3",
        evse_id: "IN*CPO*E3",
        status: "AVAILABLE",
        capabilities: ["REMOTE_START_STOP"],
        connectors: [
          {
            id: "C3",
            standard: "IEC_62196_T2",
            format: "CABLE",
            power_type: "DC",
            max_voltage: 750,
            max_amperage: 200,
            tariff_ids: ["TARIFF2"],
            last_updated: new Date()
          }
        ],
        last_updated: new Date()
      }
    ]
  }

];