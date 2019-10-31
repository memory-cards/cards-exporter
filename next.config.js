const withTypescript = require("@zeit/next-typescript");
const path = require("path");
const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = withCSS(
  withSass(
    withTypescript({
      webpack(config, options) {
        // Do not run type checking twice:
        if (options.isServer) {
          config.plugins.push(new ForkTsCheckerWebpackPlugin());
        }
        config.resolve.alias = {
          "~": path.resolve(__dirname)
        };
        return config;

        return config;
      }
    })
  )
);
