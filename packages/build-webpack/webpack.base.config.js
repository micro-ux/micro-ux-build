const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const isEnvProduction = process.env.NODE_ENV === "production";
const isAnalyze = process.env.WEBPACK_PROFILE === "analyze";

const webPackBaseConfig = {
  entry: {
    index: "./src/index",
  },
  target: "web",
  mode: isEnvProduction ? "production" : "development",
  devtool: isEnvProduction ? undefined : "source-map",
  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: "[name].js",
    libraryTarget: "umd", // AMD + CommonJS
  },
  // No externals as of now - would be ideal if this library is free from any dependencies
  externals: [],
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.(ts|js|tsx|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".js", ".tsx", ".jsx"],
  },
  optimization: {
    minimize: isEnvProduction,
    minimizer: [new TerserPlugin()],
  },
};

if (isAnalyze) {
  webPackBaseConfig.plugins.push(
    new BundleAnalyzerPlugin({
      openAnalyzer: true,
      generateStatsFile: true,
    })
  );
}

module.exports = webPackBaseConfig;
