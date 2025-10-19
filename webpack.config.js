const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const dist = path.resolve(__dirname, "dist");

const commonResolve = {
	alias: {
		"@lib": path.resolve(__dirname, "src/lib/"),
	},
	extensions: [".js"], // so you can write `@lib/api` without .js
};

module.exports = [
	// Background (service worker)
	{
		name: "background",
		mode:
			process.env.NODE_ENV === "production"
				? "production"
				: "development",
		entry: { background: "./src/background/background.js" },
		output: {
			path: dist,
			filename: "[name].js",
			clean: true,
		},
		target: "webworker", // service worker context
		devtool: "source-map",
		plugins: [
			new Dotenv(), // exposes process.env.*
			new CopyPlugin({
				patterns: [
					{ from: "manifest.json", to: dist },
					{ from: "./src/pages/popup.html", to: dist },
					// { from: 'icons', to: path.join(dist, 'icons') }, // if you have icons
				],
			}),
		],
		module: {
			rules: [], // background typically no CSS
		},
		resolve: commonResolve,
	},

	// Content script bundle
	{
		name: "content",
		mode:
			process.env.NODE_ENV === "production"
				? "production"
				: "development",
		entry: { content: "./src/content/content.js" },
		output: {
			path: dist,
			filename: "[name].js",
		},
		target: "web",
		devtool: "source-map",
		plugins: [new Dotenv()],
		module: {
			rules: [
				{
					test: /\.css$/i,
					use: ["style-loader", "css-loader"],
				},
			],
		},
		// (optional) nice import aliases:
		resolve: commonResolve,
	},
];
