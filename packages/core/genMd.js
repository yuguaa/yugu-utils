// 获取当前目录的README-base.md文件内容
const fs = require('fs')
const path = require('path')

// 获取当前目录的README-base.md文件内容,和src目录下所有的md文件的内容，并合并在一起，输出到README.md文件中
const genMd = () => {
  const baseMd = fs.readFileSync(path.resolve(__dirname, './README-base.md'), 'utf-8') + '\n'
  let srcMd = ''
  const srcDir = getSrcDir()
  srcDir.forEach(name => {
    srcMd += readSrcMdFileSync(name)
  })
  fs.writeFileSync(path.resolve(__dirname, './README.md'), baseMd + srcMd)
}
const readSrcMdFileSync = name => {
  const md = fs.readFileSync(path.resolve(__dirname, `./src/${name}/README.md`), 'utf-8')
  return md + '\n'
}
// 获取src下所有的文件夹
const getSrcDir = () => {
  const srcPath = path.resolve(__dirname, './src')
  const srcDir = fs.readdirSync(srcPath).filter(name => {
    const stat = fs.statSync(path.join(srcPath, name))
    return stat.isDirectory()
  })
  return srcDir
}

genMd()
