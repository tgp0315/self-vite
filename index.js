const Koa = require('koa')
// const fs = require('fs')
// const path = require('path')
// const compilerSFC = require('@vue/compiler-sfc')
// const compilerDOM = require('@vue/compiler-dom')
const app = new Koa()
console.log(app.use, 'app8')
const { serveStaticPlugin } = require('./plugins/serverStaticPlugin.js')

const { moduleRewritePlugin } = require('./plugins/moduleRewritePlugin.js')

const { moduleResolvePlugin } = require('./plugins/moduleResolvePlugin.js')

const { htmlRewritePlugin } = require('./plugins/serverPluginHtml.js')

const { vuePlugin } = require('./plugins/serverVuePlugin.js')

const { cssPlugin } = require('./plugins/serverCssPlugin.js')
// function rewriteImports(content) {
//   return content.replace(/ from ['|"]([^'"]+)['|"]/g, function(s0, s1) {
//     console.log('s', s0, s1)

//     if (s1[0] !== "." && s1[1] !== '/') {
//       return ` from '/@modules/${s1}'`
//     } else {
//       return s0
//     }
//   })
// }
// console.log(moduleRewritePlugin, 'moduleRewritePlugin')
function createServer() {
  const app = new Koa()
  const root = process.cwd()

  const content = {
    app,
    root // 当前的根的位置
  }
  const resolvePlugins = [ // 插件的集合
    htmlRewritePlugin,
    
    cssPlugin,
    // 2 解析 import 重写路径
    moduleRewritePlugin,
    // 3 解析 以 @/modules文件开头的内容   找到对应的结果
    moduleResolvePlugin,

    vuePlugin,
    // 1 要实现静态服务功能
    serveStaticPlugin // 功能是读取文件将文件的结果放到ctx.body上
  ]
  
  resolvePlugins.forEach(plugin => {
    plugin(content)
  })
  return app
}




// app.use(async ctx => {
//   const {
//     request: {
//       url, query
//     }
//   } = ctx
//   console.log('url', url, query.type)
//   // 首页请求
//   if (url === '/') {
//     ctx.type = 'text/html'
//     const content = fs.readFileSync('./index.html', 'utf-8')
//     ctx.body = content
//   } else if (url.endsWith('.js')) {
//     const p = path.resolve(__dirname, url.slice(1))
//     ctx.type = 'application/javascript'
//     const content = fs.readFileSync(p, 'utf-8')
//     ctx.body = rewriteImports(content)
//   } else if (url.endsWith('.css')) {
//     const p = path.resolve(__dirname, url.slice(1))
//     const file = fs.readFileSync(p, 'utf-8')
//     const content = `
//       const css = '${file.replace(/\n/g, '')}'
//       let link = docuemnt.createElement(style)
//       link.setAttribute('type', 'text/css')
//       document.head.appendChild(link)
//       link.innerHTML = css
//       export default css
//     `
//     ctx.type = 'application/javascript'
//     ctx.body = content
    
//   } else if (url.indexOf('.vue') > -1) {
//     const p = path.join(__dirname, url.split("?")[0]);
//     const ret = compilerSFC.parse(fs.readFileSync(p, "utf8"));
//     if (!query.type) {
//       // SFC请求
//       // 读取vue文件，解析为js
//       // 获取脚本部分的内容
//       const scriptContent = ret.descriptor.script.content;
//       // 替换默认导出为一个常量，方便后续修改
//       const script = scriptContent.replace(
//         "export default ",
//         "const __script = "
//       );
//       ctx.type = "application/javascript";
//       ctx.body = `
//         ${rewriteImports(script)}
//         // 解析tpl
//         import {render as __render} from '${url}?type=template'
//         __script.render = __render
//         export default __script
//       `;
//     } else if (query.type === "template") {
//       const tpl = ret.descriptor.template.content;
//       // 编译为render
//       const render = compilerDOM.compile(tpl, { mode: "module" }).code;
//       ctx.type = "application/javascript";
//       ctx.body = rewriteImports(render);
//     }
//   }  else if (url.startsWith("/@modules/")) {
//     const prefix = path.resolve(__dirname, 'node_modules', url.replace('/@modules/', ''))
//     const module = require(prefix + '/package.json').module
//     const p = path.resolve(prefix, module)
//     const ret = fs.readFileSync(p, 'utf-8')
//     ctx.type = 'application/javascript'
//     ctx.body = rewriteImports(ret)
//   }
// })

// app.listen(3099, () => {
//   console.log('chenggong')
// })
module.exports = createServer