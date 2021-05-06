'use strict';

const path = require('path');

function resolve(dir){
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  configureWebpack: {
    name: "30Hero",
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
};
