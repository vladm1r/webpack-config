const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
	const config = {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
		}
	}

	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssetsWebpackPlugin(),
			new TerserWebpackPlugin(),
		]
	}

	return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;


const babelOptions = preset => {
	const opts = {
		presets: ['@babel/preset-env'],
	}

	if (preset) {
		opts.presets.push(preset);
	}
	return opts;
}

const cssMinifyInProd = () => {
	if (isProd) {
		return MiniCssExtractPlugin.loader;
	}

	return "style-loader";
}

module.exports = {
	target: "web",
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: {
		main: ['@babel/polyfill', './index.jsx'],
		analytics: './analytics.js',
	},
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist'),
	},
	optimization: optimization(),
	devServer: {
		open: isDev,
		hot: isDev,
		port: 8080,
	},
	devtool: isDev ? 'source-map' : false,
	plugins: [
		new HTMLWebpackPlugin({
			template: './index.html',
			minify: {
				collapseWhitespace: isProd
			},
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: filename('css'),
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src/favicon.ico'),
					to: path.resolve(__dirname, 'dist'),
				}
			],
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [cssMinifyInProd, 'css-loader']
			},
			{
				test: /\.s[ac]ss$/,
				use: [cssMinifyInProd, 'css-loader', 'sass-loader']
			},
			{
				test: /\.(png|jpg|gif)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				type: 'asset/inline',
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: babelOptions(),
				}
			},
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: babelOptions("@babel/preset-react"),
				}
			},
		]
	}
}