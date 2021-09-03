/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1629523943832_1751";

  // add your middleware config here
  config.middleware = [];
  //  socket.io
  config.io = {
    init: {},
    namespace: {
      "/": {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  };
  config.multipart = {
    mode: "file",
    fileSize: "30mb",
    whitelist: [".jpg", ".png", ".webp", ".gif"],
  };
  //mongoose

  config.mongoose = {
    client: {
      url: "mongodb://127.0.0.1:27017/ktalk",
      options: {useUnifiedTopology: true, },
      plugins: [],
    },
  };

  config.cors = {
    origin: "http://localhost:8080",
    credentials: true, //允许Cook可以跨域
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS",
  };
  //关闭安全系统
  config.security = {
    csrf: {
      enable: false,
    },
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
