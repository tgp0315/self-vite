const { Readable } = require('stream')
const MagicString = require('magic-string') // 因为字符串具有不变性
const { parse } = require('es-module-lexer') // 解析import语法
async function readBody(stream) {
  // koa 中所有的异步方法必须封装成promise
  if (stream instanceof Readable) {
    return new Promise((resolve, reject) => {
      let res = ''
      stream.on('data', data => {
        res += data
      })

      stream.on('end', () => {
        resolve(res)  // 将解析完的内容抛出去
      })
    })
  } else {
    return stream.toString()
  }
}

function rewriteImports(content) {
  return content.replace(/ from ['|"]([^'"]+)['|"]/g, function(s0, s1) {

    if (s1[0] !== "." && s1[1] !== '/') {
      return ` from '/@modules/${s1}'`
    } else {
      return s0
    }
  })
}

exports.readBody = readBody
exports.rewriteImports = rewriteImports