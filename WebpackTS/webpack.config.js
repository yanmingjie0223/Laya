
const webpack = require('webpack');

module.exports = {
    entry: './index.ts',

    devtool: 'eval-source-map',

    output: {
        filename: './bin/all.min.js',
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader:'ts-loader'
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    },

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.tsx', '.ts', '.js']
    },

    devServer:{
        contentBase: 'bin', //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        hot: true, //实时刷新
        inline: true,
        port: 8888
    },

    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new webpack.optimize.UglifyJsPlugin({  //压缩混淆
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        // new webpack.HotModuleReplacementPlugin(), //热加载插件,这里会出现hot-update记录文件
    ]

}