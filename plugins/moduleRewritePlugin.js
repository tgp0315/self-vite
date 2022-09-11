const fs = require('fs')
const path = require('path')
const { rewriteImports } = require('../utils/index.js')
const aliasResolver = require('./aliasResolve')
const viteConfig = require(path.join(process.cwd(), 'vite.config.js'))
console.log(viteConfig, 'viteConfig')
// console.log(readBody, rewriteImports, 'readBody, rewriteImports')
/**
 * @description
 * @param {*} app
 * @param {*} root  项目根目录
 */
function moduleRewritePlugin({app, root}) {
  app.use(async (ctx, next) => {
    await next()
    const {
      request: {
        url, query
      }
    } = ctx
    // 获取流中的数据
    if (url.endsWith('.js')) {
      const p = path.join(root, url.slice(1))
      ctx.type = 'application/javascript'
      const content = fs.readFileSync(p, 'utf-8')
      const lastResult = aliasResolver(viteConfig.resolve.alias, content)
      console.log(lastResult, 'lastResult')
      ctx.body = rewriteImports(lastResult) 
    }
  })
}

exports.moduleRewritePlugin = moduleRewritePlugin