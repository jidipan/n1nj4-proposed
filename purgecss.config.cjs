module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  css: ["./src/**/*.css"],
  output: "./.purgecss-output",
  fontFace: true,
  keyframes: true,
  variables: true,
  rejected: true,
  safelist: {
    standard: [/^rk-/, /^w3m-/, /^walletconnect-/],
    deep: [/^rainbowkit/],
  },
};
