const midtransClient = require("midtrans-client");

export const midtransClientConfig = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});
