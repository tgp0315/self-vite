const { rewriteImports } = require('../utils/index')
// const moduleRge = /^\/@modules\//
const fs = require('fs')
const path = require('path')
function moduleResolvePlugin({app, root}) {
  app.use(async (ctx, next) => {
    const {
      request: {
        url, query
      }
    } = ctx
    await next()
    if (url.startsWith("/@modules/")) { 
      const prefix = path.join(root, 'node_modules', url.replace('/@modules/', ''))
      const module = require(prefix + '/package.json').module
      const p = path.join(prefix, module)
      const ret = fs.readFileSync(p, 'utf-8')
      ctx.type = 'application/javascript'
      ctx.body = rewriteImports(ret) 
    }
  })
}

exports.moduleResolvePlugin = moduleResolvePlugin