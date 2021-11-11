// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');  // node自带包
const resolve = dir => path.resolve(__dirname, dir);
module.exports = (env, argv)=> {
    return {
        entry:{ 
            main:__dirname+'/src/index.ts',
            global:__dirname+'/src/global.ts',
        },   // 打包对入口文件，期望打包对文件入口
        output:{
            filename:'index.[name].js',   // 输出文件名称
            // sourceMapFilename:'index.[name].map.js',   // 输出文件名称
            path:path.resolve(__dirname,'dist'),  //获取输出路径
            // library:'viewScroller',   //引入的名字
            /* 根据入口entry设定的环境对应编译后的文件名 */
            library: ["index", "[name]"],
            libraryTarget:'umd',
            umdNamedDefine:true,
        },
        devtool:argv.mode === 'production'?'cheap-module-source-map':'cheap-module-eval-source-map',
        // mode: 'development',   // 整个mode 可以不要，模式是生产坏境就是压缩好对，这里配置开发坏境方便看生成对代码
        module:{
            rules: [
                {
                    test: /\.js$/,
                    exclude: {
                        test: /node_modules/, // Exclude libraries in node_modules ...
                        not: [
                        // Except for a few of them that needs to be transpiled because they use modern syntax
                        /snabbdom/
                        ]
                    },
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { targets: "ie 9" }]
                            ]
                        }
                    }
                },
                {
                    test: /\.tsx?$/,
                    use: ['ts-loader'],
                    // use:'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(scss|css)$/,
                    use: [
                        /* 不再把scss打包成css，改为使用style-loader内联 */
                        // {
                        //     loader: MiniCssExtractPlugin.loader
                        // },
                        'style-loader',
                        {
                            // Interprets CSS
                            loader: "css-loader",
                            options: {
                                importLoaders: 2
                            }
                        },
                        {
                            loader: 'sass-loader' // 将 Sass 编译成 CSS
                        }
                    ]
                }
            ]
        },
        devServer: {
            // contentBase: path.resolve(__dirname, '/'),
            hot: true
        },
        resolve: {
            extensions: ['.ts','.tsx', '.js'],    // 解析文件格式
            // 设置别名
            alias: {
                '@': resolve('src')// 这样配置后 @ 可以指向 src 目录
            }
        },
        plugins: [
            /* 不再把scss打包成css，改为使用style-loader内联 */
            // Where the compiled SASS is saved to
            // new MiniCssExtractPlugin({
            //     filename: 'index.css',
            //     allChunks: true,
            // })
        ],
        optimization: {
            minimizer: [
                // 有时候webpack会默认优化z-index值，设置默认不优化
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        safe: true
                    }
                }),
                new UglifyJsPlugin({
                    sourceMap: true,
                    uglifyOptions: {
                        compress: false
                    }
                })
            ]
        }
    }
}