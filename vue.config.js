const path = require('path');

module.exports = {
  devServer: {
   // port: 80, // 원하는 포트 번호로 변경
    allowedHosts: "all",
  },
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/')
      },
      extensions: ['.js', '.vue', '.json', '.ts']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true
          },
          exclude: /node_modules/
        }
      ]
    }
  }
};
