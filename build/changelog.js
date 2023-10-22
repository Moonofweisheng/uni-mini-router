const fs = require('fs')
const path = require('path')
const fromPath = path.resolve(__dirname, '../CHANGELOG.md')
const docPath = path.resolve(__dirname, '../docs/guide')

try {
  const file = fs.readFileSync(fromPath, 'utf-8')
  fs.writeFileSync(`${docPath}/changelog.md`, file)
} catch (error) {
  console.log('CHANGELOG 获取失败')
}
