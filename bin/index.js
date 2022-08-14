#! /usr/bin/env node

const createServer = require('../index')

const app = createServer()

app.listen(3088, () => {
  console.log('启动成功')
})