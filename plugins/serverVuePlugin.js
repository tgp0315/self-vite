const path = require('path')
const fs = require('fs')
const compilerSFC = require('@vue/compiler-sfc')
const compilerDOM = require('@vue/compiler-dom')
const { rewriteImports } = require('../utils/index')
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
function vuePlugin({ app, root }) {
  app.use(async (ctx, next) => {
    await next()
    const {
      request: {
        url, query
      }
    } = ctx
    if (url.indexOf('.vue') > -1) {
      const p = path.join(root, url.split("?")[0]);
      console.log(p, 'p')
      const ret = compilerSFC.parse(fs.readFileSync(p, "utf8"));
      if (!query.type) {
        // SFC请求
        // 读取vue文件，解析为js
        // 获取脚本部分的内容
        const scriptContent = ret.descriptor.script.content;
        // 替换默认导出为一个常量，方便后续修改
        const script = scriptContent.replace(
          "export default ",
          "const __script = "
        );
        ctx.type = "application/javascript";
        ctx.body = `
          ${rewriteImports(script)}
          // 解析tpl
          import {render as __render} from '${url}?type=template'
          __script.render = __render
          export default __script
        `;
      } else if (query.type === "template") {
        const tpl = ret.descriptor.template.content;
        // 编译为render
        const render = compilerDOM.compile(tpl, { mode: "module" }).code;
        ctx.type = "application/javascript";
        ctx.body = rewriteImports(render);
      }
    }
  })
}

exports.vuePlugin = vuePlugin