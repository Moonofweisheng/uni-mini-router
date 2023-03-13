/*
 * @Author: 徐庆凯
 * @Date: 2022-12-02 14:34:18
 * @LastEditTime: 2023-03-10 11:41:26
 * @LastEditors: 徐庆凯
 * @Description: .d.ts移动到制品
 * @FilePath: \uni-read-pages-vite\typesCopy.js
 * 记得注释
 */
const fs = require("fs");
const path = require("path");
const srcRoot = path.join(__dirname, './src')
const targetSrcRoot = path.join(__dirname, "./lib");
const componentRoot = path.join(__dirname, "./src");
const componentNames = fs
  // 获取所有文件夹及文件
  .readdirSync(`${componentRoot}`, {
    withFileTypes: true
  })
  // 筛选出所有文件夹
  .filter((p) => {
    return p.isDirectory() && fs.existsSync(`${componentRoot}/${p.name}/index.ts`)
  })
  // 数据预处理
  .map((p) => {
    return {
      path: `${p.name}/index`,
      name: p.name,
    }
  })
  .concat({
    path: "index",
    name: "index"
  })

const copy = () => {
  componentNames.forEach((component) => {
    let sourcePath = `${srcRoot}/${component.path.replace(/index/g,'')}/index.d.ts`.replace(/src/g, 'lib/types').replace(/\/\//g, '/')
    let targetPath = sourcePath.replace(/types\//g, '')
    try {
      fs.copyFileSync(sourcePath, targetPath);
    } catch (e) {
      console.log(e, "复制失败");
    }
  });
}

const deleteTarget = function (tarPath) {
  if (!fs.existsSync(tarPath)) {
    return
  }
  let files = fs.readdirSync(tarPath)
  files.forEach(function (filename) {
    const filedir = path.join(tarPath, filename)
    let stats = fs.statSync(filedir)
    const isFile = stats.isFile()
    if (isFile) {
      // 复制文件
      fs.rmSync(filedir)
    } else {
      deleteTarget(filedir) // 递归
    }
  })
  fs.rmdirSync(tarPath)
}

copy()
deleteTarget(path.join(targetSrcRoot, "./types"))