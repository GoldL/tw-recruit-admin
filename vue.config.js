module.exports = {
  // 路径前缀
  publicPath: process.env.NODE_ENV === 'development' ? './' : '/tw-recruit-admin/',
  outputDir: 'tw-recruit-admin',
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: config => {
    // 忽略的打包文件
    const externals = {
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios'
    }
    if (process.env.NODE_ENV === 'production') {
      Object.assign(externals, {
        vue: 'Vue',
        'element-ui': 'ELEMENT'
      })
    }
    config.externals(externals)
    const entry = config.entry('app')
    entry.add('babel-polyfill').end()
    entry.add('classlist-polyfill').end()
    entry.add('@/mock').end()
  },
  css: {
    extract: { ignoreOrder: true },
    loaderOptions: {
      sass: {
        data: '@import "@/styles/variables.scss";'
      }
    }
  },
  // 开发模式反向代理配置，生产模式请使用Nginx部署并配置反向代理
  devServer: {
    port: 1888,
    proxy: {
      '/tw-recruit-api': {
        // 本地服务接口地址
        target: 'https://twrecruittest.0101data.cn',
        ws: true
      }
    }
  }
}
