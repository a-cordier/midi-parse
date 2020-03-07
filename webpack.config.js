const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

const isProd = env => env === 'prod';
const isDev = env => !isProd(env);

const getPluginConfig = (env) => {
	const plugins = [];
	if (isProd(env)) {
		plugins.push(new CleanPlugin(['dist']));
	}
	return plugins;
};

const config = env => ({
	entry: {
			// eslint-disable-next-line no-undef
		'midi-parse': path.join(__dirname, 'src', 'index.js'),
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		library: 'mid-parse',
		libraryTarget: 'commonjs',
	},
	devtool: isDev(env) ? 'source-map' : false,
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['es2017'],
						plugins: [
							'transform-runtime',
							'transform-es2015-block-scoping',
						],
					},
				},
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.js'],
		alias: {
			'@': './src/',
		},
		modules: [
			path.resolve('./node_modules'),
		],
	},
	plugins: getPluginConfig(env),
});

module.exports = config;
