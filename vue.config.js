const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@icons': path.resolve(__dirname, 'src/assets/icons'), // Алиас для папки с иконками
      },
    },
  },
})
