const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // 👈 no activa en localhost
});

module.exports = withPWA({
  reactStrictMode: true,
});
