module.exports = {
  devServer: {
    open: true,
    hot: true, 
  },
  // 关闭保存eslint 校验
  lintOnSave:false,
  publicPath: '.',
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
}