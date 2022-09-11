module.exports = function(aliasConfig, content) {
  const entries = Object.entries(aliasConfig)
  let lastContent = content
  entries.forEach(enrtire => {
    const [ alias, path] = enrtire
    const regex = `/${alias}/g`
    console.log(typeof regex, 'regex')
    lastContent = content.replace(eval(regex), path)
  })
  console.log(lastContent, 'lastContent')
  // console.log(alias, content, 'aliasConfig')
  
  return lastContent
}