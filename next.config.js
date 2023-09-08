const webpack = require("webpack");

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("cesium"),
      })
    );
    config.resolve.fallback = { fs: false };
    return config;
  },
};
