const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// Needed because of empty js files generated from css, see issue:
// https://github.com/webpack/webpack/issues/11671
const RemovePlugin = require("remove-files-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const coreConfig = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.scss/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
};

const siteConfig = {
    ...coreConfig,
    entry: { main: "./src/js/site.js", style: "./src/css/site/style.scss" },
    name: "site",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist/site"),
    },
    plugins: [
        ...coreConfig.plugins,
        new RemovePlugin({
            after: {
                include: ["./dist/site/style.js"],
            },
        }),
        new CopyPlugin({
            patterns: [
                { from: "./vendor/mathquill-0.10.1/font", to: "font" },
                {
                    from: "./vendor/mathquill-0.10.1/mathquill.css",
                    to: "mathquill.css",
                },
                {
                    from: "./src/site",
                },
            ],
        }),
    ],
};

const extensionConfig = {
    ...coreConfig,
    entry: {
        main: "./src/js/chromeExtension.js",
        style: "./src/css/chrome_extension/style.scss",
    },
    name: "chrome_extension",
    mode: "production",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist/chrome_extension"),
    },
    plugins: [
        ...coreConfig.plugins,
        new RemovePlugin({
            after: {
                include: ["./dist/chrome_extension/style.js"],
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "./vendor/mathquill-0.10.1/font",
                    to: "font",
                },
                {
                    from: "./vendor/mathquill-0.10.1/mathquill.css",
                    to: "mathquill.css",
                },
                {
                    from: "./src/chrome_extension",
                },
            ],
        }),
    ],
    //	optimization: {
    //		minimize: false,
    //	},
};

module.exports = [siteConfig, extensionConfig];
