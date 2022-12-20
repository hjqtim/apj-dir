const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    createProxyMiddleware('/engine-rest', {
      // target: 'http://10.240.131.123:3006/',
      target: 'http://localhost:3000/',
      changeOrigin: false
    })
  );
};
