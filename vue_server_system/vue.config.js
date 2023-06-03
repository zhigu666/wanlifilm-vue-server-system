module.exports = {
  devServer: {
    port: 8096, //修改启动端口
    proxy: {
      //设置代理，进行跨域  http://localhost:10001/index/captcha
      '/api': {
        //拦截上下文
        target: 'http://localhost:10001', //匹配到要代理的上下文后，将上下文前面的地址替换为此代理地址
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/api': '', //拦截到的上下文重写，这里可以将 elm 重写为空或者其它值，因为我不需要重写，所以这里这么配置。
        },
      },
    },
  },
}
