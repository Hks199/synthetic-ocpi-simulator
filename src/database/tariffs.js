module.exports = [
  {
    country_code: "IN",
    party_id: "CPO",
    id: "TARIFF1",
    currency: "INR",
    elements: [
      {
        price_components: [
          {
            type: "ENERGY",
            price: 20, // ₹20 per kWh
            step_size: 1
          }
        ]
      }
    ],
    last_updated: new Date()
  },

  {
    country_code: "IN",
    party_id: "CPO",
    id: "TARIFF2",
    currency: "INR",
    elements: [
      {
        price_components: [
          {
            type: "ENERGY",
            price: 25, // Fast charger ₹25/kWh
            step_size: 1
          }
        ]
      }
    ],
    last_updated: new Date()
  }
];


