const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const isDev = process.env.NODE_ENV === 'development'
console.log('IS DEV: ', isDev)

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (!isDev) {
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}


const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = add => {
    loaders = [{
        loader: MiniCssExtractPlugin.loader,
        options: {},
    }, 'css-loader']

    if (add) {
        loaders.push(add)
    }
    return loaders
}

const babelOptions = preset => {

    const opt = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if (preset) {
        opt.presets.push(preset)
    }
    return opt
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]

    if (isDev) {
    //loaders.push('eslint-loader')
    }
    return loaders
}

const plugins = () => {
    const base = [
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: !isDev
            }

        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),  //isDev ? "[name].css" : "[name].[hash].css",
            chunkFilename: isDev ? "[id].css" : "[id].[hash].css",
        })
    ]

if (!isDev) {
    base.push(new BundleAnalyzerPlugin())
}
    return base
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.jsx'],
        analitics: './analitics.ts'
    },
    output: {
        filename: filename('js'), //'[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4400,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : false,
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: 'asset/resource',
            }, {
                test: /\.(ttf|woff|woff2)$/,
                type: 'asset/resource',
            }, {
                test: /\.xml$/,
                use: ['xml-loader']
            }, {
                test: /\.csv$/,
                use: ['csv-loader']
            }, {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            }, {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            }, {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            }, {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            }

        ]
    }
}