module.exports = {
  devServer: {
    open: true,
    hot: true
  },
  // 关闭保存eslint 校验
  lintOnSave: false,
  publicPath: '.',
  // 解决vue3 template 编译警告
  configureWebpack: {
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm-bundler.js'
      }
    }
  },
  // 解决 antd less 警告
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  // 添加插件
  chainWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      // 大文件可视化分析插件
      config.plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        .end()
    }
  }
}
