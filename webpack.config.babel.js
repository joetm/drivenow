import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import path from 'path';

const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV !== 'production';

module.exports = {
	context: path.resolve(__dirname, "src"),
	entry: [
		'whatwg-fetch',
		'./entry.js'
	],
	output: {
		path: path.resolve(__dirname, "build"),
		publicPath: '/',
		filename: 'bundle.js'
	},

	resolve: {
		extensions: ['', '.jsx', '.js', '.json', '.scss', '.css'],
		modulesDirectories: [
			// path.resolve(__dirname, "src/lib"),
			'node_modules'
		],
		alias: {
			components: path.resolve(__dirname, "src/components"), // used for tests
			style: path.resolve(__dirname, "src/style"),
			'react': 'preact-compat',
			'react-dom': 'preact-compat',
            jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js')
		}
	},

	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				exclude: /src\//,
				loader: 'source-map'
			}
		],
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
		        loader: 'babel-loader',
		        query: {
		          presets: ['react', 'es2015'] // , 'stage-0'
		        }
			},
			{
				test: /\.(scss|css)$/,
				// exclude: /src\/components\//,
				loader: ExtractTextPlugin.extract('style?singleton', [
					`css?sourceMap`, // =${CSS_MAPS}
					'postcss',
					`sass?sourceMap&outputStyle=expanded` // =${CSS_MAPS}
				].join('!'))
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
		    {
        		// make all files ending in .json5 use the `json5-loader`
		        test: /\.json5$/,
		        exclude: /(node_modules|bower_components|projects)/,
		        loader: 'json5-loader'
		    },
	        {
		        test: /\.(ico|jpe?g|png|gif)$/,
		        loader: "file"
	        },
			// {
			// 	test: /\.(xml|html|txt|md)$/,
			// 	loader: 'raw'
			// },
			{
				test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
				loader: ENV === 'production' ? 'file?name=[path][name]_[hash:base64:5].[ext]' : 'url'
			}
		]
	},

	postcss: () => [
		autoprefixer({ browsers: 'last 2 versions' })
	],

	plugins: ([
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin('style.css', {
			allChunks: true,
			disable: ENV !== 'production'
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify({ NODE_ENV: ENV })
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html'
			// minify: {
			// 	collapseWhitespace: true
			// }
		})
	]).concat(ENV==='production' ? [
		new webpack.optimize.OccurenceOrderPlugin()
	] : []),

	stats: { colors: true },

	node: {
		global: true,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false
	},

	devtool: ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

	devServer: {
		port: process.env.PORT || 8080,
		host: '0.0.0.0',
		colors: true,
		publicPath: '/',
		contentBase: './src',
		historyApiFallback: true,
		proxy: {
			// OPTIONAL: proxy configuration:
			// '/optional-prefix/**': { // path pattern to rewrite
			//	 target: 'http://target-host.com',
			//	 pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
			// }
		}
	}
};
