// const { readBody } = require('../utils')
const fs = require('fs')

function htmlRewritePlugin({app, root}) {
  const inject = `
    <script>
      window.process = {
        env: {
          NODE_ENV: 'development'
        }
      }
    </script>
  `
  app.use(async (ctx, next) => {
    await next()
    const {
      request: {
        url, query
      }
    } = ctx
    if (url === '/') {
      ctx.type = 'text/html'
      const content = fs.readFileSync('./index.html', 'utf-8')
      ctx.body = content.replace(/<head>/, `$&${inject}`)
    }
  })
}

exports.htmlRewritePlugin = htmlRewritePlugin