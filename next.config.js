const { devIndicatorServerState } = require("next/dist/server/dev/dev-indicator-server-state");

const isElectron = process.env.ELECTRON === "true";

module.exports = {
  output: "standalone",
  devIndicators: false
};