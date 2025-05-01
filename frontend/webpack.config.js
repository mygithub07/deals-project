const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const webpackConfig = {

    mode: 'development',
    entry: {
        bundle: path.join(__dirname, 'src', 'index.js'),
        //FlighContainerBundle: path.join(__dirname, 'src', 'FlighContainer.js')
    },
    devtool: 'inline-source-map',
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['@babel/plugin-syntax-jsx']
                    }
                }
            },
            {
                test: /.(css|scss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'wp-content/themes/mysearchandfind/dist/img/[name].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [
        new BrowserSyncPlugin({
            proxy: {
                target: 'https://localhost'
            },
            files: ['**/*.php'],
            cors: true,
            reloadDelay: 0,
            open: false
        }),
        new MiniCssExtractPlugin({
            filename: 'css/style.[name].css',
        }),
        new ESLintPlugin()

    ]
};

if (process.env.NODE_ENV === 'production') {
    webpackConfig.mode = 'production';
}

module.exports = webpackConfig;
