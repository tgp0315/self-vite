const { join } = require('path')
const path = require('path')

const fs = require('fs').promises

function cssPlugin({ app, root }) {
  app.use(async (ctx, next) => {
    await next()
    const {
      request: {
        url, query
      }
    } = ctx

    if (url.endsWith('.css')) {
      const p = path.join(root, url.slice(1))
      const file = fs.readFileSync(p, 'utf-8')
      const content = `
        const css = '${file.replace(/\n/g, '')}'
        let link = docuemnt.createElement(style)
        link.setAttribute('type', 'text/css')
        document.head.appendChild(link)
        link.innerHTML = css
        export default css
      `
      ctx.type = 'application/javascript'
      ctx.body = content
    }
  })
}

exports.cssPlugin = cssPlugin