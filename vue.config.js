/* eslint-disable quotes */
// /* eslint-disable @typescript-eslint/no-var-requires */

const productionEnv = process.env.NODE_ENV === "production";

const prdPrefix = `[name].[chunkhash].${new Date().getTime()}`;
const prdConfig = {
  publicPath: "/vue",
  css: {
    extract: {
      filename: `css/${prdPrefix}.css`,
      chunkFilename: `css/${prdPrefix}.css`,
    },
  },
  configureWebpack: {
    output: {
      filename: `js/${prdPrefix}.js`,
      chunkFilename: `js/${prdPrefix}.js`,
    },
  },
};
const config = productionEnv ? prdConfig : {};

module.exports = config;
