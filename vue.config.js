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

const localConfig = {
  devServer: {
    proxy: {
      "/api_v1": {
        target: `http://rheapjt-rheaspringboot.dmz1.dev.cip.digitalkds.co.kr`,
        // ws: true,
        // changeOrigin: true,
      },
    },
  },
};

const config = productionEnv ? prdConfig : localConfig;

module.exports = config;
