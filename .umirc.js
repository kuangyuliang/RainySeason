
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: true,
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
      },
      locale: {
        default: 'zh-CN'
      },
      title: 'RainySeason',
      dll: false,

      // routes: {
      //   exclude: [
      //     /models\//,
      //     /services\//,
      //     /model\.(t|j)sx?$/,
      //     /service\.(t|j)sx?$/,
      //     /components\//,
      //   ],
      // },
    }],
  ],
  proxy: {
    "/api": {
      target: "http://localhost:21021/api/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" }
    },
    "/air": {
      target: 'http://117.121.97.122:9035/',
      changeOrigin: true,
      pathRewrite: { "^/air": "" }
    },
    "/windy": {
      target: "http://202.104.69.206:96/",
      changeOrigin: true,
      pathRewrite: { "^/windy": "" }
    }
  },
}
