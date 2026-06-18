const isElectron = process.env.ELECTRON === "true";

module.exports = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  devIndicators: false,
};