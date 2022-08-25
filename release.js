/* eslint-disable import/dynamic-import-chunkname */
const chalk = require('chalk')
const child = require('child_process')
const symbols = import('log-symbols')
const { prompt } = require('enquirer')
const execa = require('execa')

const run = (bin, args, opts = {}) => execa(bin, args, {stdio: 'inherit', ...opts})

const step = msg => console.log(chalk.cyan(msg))

async function main() {

  const { commit } = await prompt({
    type: 'input',
    name: 'commit',
    message: '请输入commit内容'
  })

  if (!commit) return false

  // await run('npm', ['run', 'lint'])

  step('\nCommitting changes...')
  await run('git', ['add', '-A'])
  await run('git', ['commit', '-m', `${commit}`])
  await run('git', ['pull'])
  await run('git', ['push'])
}

let loadCmd = async cmd => {
  await child.exec(cmd, async (error, stdout, stderr) => {
    if (error) {
      console.log(symbols.error, chalk.red(`执行失败${error}`))
      return
    }
    console.log(symbols.success, chalk.green(`执行成功`))
  })
}
main().catch((err) => console.error(err))
