

const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}

const isProduction = process.env.NODE_ENV === 'production';
// const BASE_URL = isProduction ? '/svs' : '/';
const BASE_URL='/';
// 线上打包使用可压缩 GZIP
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

module.exports={
    publicPath: BASE_URL,

    runtimeCompiler:true,
    outputDir: './static',
    // build时放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
    assetsDir: 'resource',
    // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
    indexPath: 'index.html',

    // 是否生成map(调试定位)
    productionSourceMap: false,

    configureWebpack: {
      externals: {
       // 如果需要使用cdn方式,可以减少打包后chunk-vendors文件的大小（150~200kb左右）
       // 'vue': 'Vue',
       // 'vue-router': 'VueRouter',
       // 'vuex': 'Vuex'
      },
      plugins: [
          new CompressionWebpackPlugin({
              filename: '[path].gz[query]',   
              algorithm: 'gzip',
              test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
              threshold: 10240,
              minRatio: 0.8
          })
      ],
      module: {
        rules: [
          // 'transform-runtime' 插件告诉 Babel
          // 要引用 runtime 来代替注入。
          {
            test: /\.m?js$/,
            include: [
              resolve('src'),
              resolve('node_modules/view-design/src')
            ],
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      }
     
    },
    chainWebpack: config => {
      config.resolve.alias
        // .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
        .set('_c', resolve('src/components'))
    },
    devServer:{
      proxy:{
        '/svs':{
           target:'http://localhost:8080/',
           changeOrigin:true,
           pathRewrite:{
             '/svs':''
           }
        }
     }
    },
  

}