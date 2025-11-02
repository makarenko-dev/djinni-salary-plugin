const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const dotenv = require("dotenv");

const dist = path.resolve(__dirname, "dist");

const commonResolve = {
	alias: {
		"@lib": path.resolve(__dirname, "src/lib/"),
	},
	extensions: [".js"],
};

module.exports = (env, argv) => {
	const isProd = argv.mode === "production";
	const envPath = isProd ? "./.env" : "./.env.dev";
	dotenv.config({ path: envPath });
	const dotEnvPlugin = new Dotenv({
		path: envPath,
		systemvars: true,
	});
	const transformManifest = (content) => {
		const m = JSON.parse(content.toString());

		const apiOrigin = process.env.API_HOST;

		// inject runtime-specific values
		m.host_permissions = [`${apiOrigin}/*`];
		return Buffer.from(JSON.stringify(m, null, 2));
	};
	return [
		{
			name: "background",
			mode: argv.mode,
			entry: { background: "./src/background/background.js" },
			output: {
				path: dist,
				filename: "[name].js",
			},
			target: "webworker",
			devtool: "source-map",
			plugins: [
				dotEnvPlugin,
				new CopyPlugin({
					patterns: [
						{
							from: "manifest.template.json",
							to: "manifest.json",
							transform: transformManifest,
						},
						{ from: "./src/pages/popup.html", to: dist },
						{ from: "images", to: "images" },
					],
				}),
			],
			module: {
				rules: [],
			},
			resolve: commonResolve,
		},

		{
			name: "content",
			mode: argv.mode,
			entry: { content: "./src/content/content.js" },
			output: {
				path: dist,
				filename: "[name].js",
			},
			target: "web",
			devtool: "source-map",
			plugins: [
				dotEnvPlugin,
				new CopyPlugin({
					patterns: [{ from: "./src/content/content.css", to: dist }],
				}),
			],
			module: {
				rules: [
					{
						test: /\.css$/i,
						use: ["style-loader", "css-loader"],
					},
				],
			},
			resolve: commonResolve,
		},
	];
};
