const static = require('koa-static')
const path = require('path')
function serveStaticPlugin({app, root}) {
  // vite在哪运行，就以哪个目录启动静态服务
  app.use(static(root))
  app.use(static(path.join(root, 'public')))
} 

exports.serveStaticPlugin = serveStaticPlugin