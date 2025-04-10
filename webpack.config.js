import { createRequire } from "module";
import path from "path";
import webpack from "webpack";

const require = createRequire(import.meta.url);

export default {
  entry: "./src/index.js",
  optimization: {
    minimize: true,
  },
  target: "webworker",
  output: {
    filename: "index.js",
    path: path.resolve(import.meta.dirname, "bin"),
    libraryTarget: "this",
  },
  module: {
    // Loaders go here.
    // e.g., ts-loader for TypeScript
    // rules: [
    // ],
  },
  resolve: {
    fallback: {
      util: require.resolve("core-js/"), // use the core js
      url: require.resolve("core-js/"), // use the core js
      fs: require.resolve("core-js/"), // use the core js
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      path: require.resolve("path-browserify"),
      buffer: require.resolve("buffer"),
      process: require.resolve("process"),
    },
  },
  plugins: [
    // Polyfills go here.
    // Used for, e.g., any cross-platform WHATWG,
    // or core nodejs modules needed for your application.
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
  externals: [
    ({request,}, callback) => {
      if (/^fastly:.*$/.test(request)) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
    'node-fetch'
  ],
};
