const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', // Главный входной файл
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js', // Скомпилированный JS
    },
    mode: 'development', // Режим разработки
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        open: true, // Автоматически открывать страницу в браузере
        hot: true, // Включить hot reload
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Для JS-файлов
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/, // Для CSS-файлов
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif|svg)$/, // Для картинок
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html', 
        }),
    ],
};
