/* eslint-disable no-undef */
/*
 * @Author: 徐庆凯
 * @Date: 2022-11-18 14:56:37
 * @LastEditTime: 2023-03-31 11:01:55
 * @LastEditors: 徐庆凯
 * @Description:
 * @FilePath: \uni-mini-router\rollup.config.js
 * 记得注释
 */
import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import rollupTypescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import fs from 'fs'
import filesize from 'rollup-plugin-filesize' // 打包后在控制台显示文件大小。

import {
  DEFAULT_EXTENSIONS
} from '@babel/core'
import {
  terser
} from 'rollup-plugin-terser'
import pkg from './package.json'

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${new Date().getFullYear()} weisheng
 */`
const componentRoot = path.join(__dirname, './src')
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
      name: p.name
    }
  })
// 当前运行环境，可通过 cross-env 命令行设置
// const env = process.env.NODE_ENV
// umd/iife 模式的编译结果文件输出的全局变量名称
let output = [
  // es module
  {
    // package.json 配置的 module 属性
    file: pkg.main,
    format: 'es',
    banner
  },
]

function createConfigs() {
  let configs = output.map((o) => {
    const config = {
      // 入口文件，src/index.ts
      input: path.resolve(__dirname, 'src/index.ts'),
      // 输出文件
      output: o,
      external: o.format === 'es' ? ['vue', 'qs'] : [],
      plugins: [
        // 解析第三方依赖
        resolve({
          jsnext: true,
          preferBuiltins: true,
          browser: true
        }),
        // 识别 commonjs 模式第三方依赖
        commonjs(),
        // rollup 编译 typescript
        rollupTypescript(),
        // babel 配置
        babel({
          // 编译库使用 runtime
          babelHelpers: 'runtime',
          // 只转换源代码，不转换外部依赖
          exclude: 'node_modules/**',
          // babel 默认不支持 ts 需要手动添加
          extensions: [...DEFAULT_EXTENSIONS, '.ts']
        }),
        // 解析json
        json(),
        filesize(),
        terser({
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false
          }
        })
      ]
    }
    return config
  })

  let config = {
    input: componentNames.reduce((result, p) => {
      let key = p.path
      result[key] = `${componentRoot}/${p.path.replace(/\/index/g, '')}`
      return result
    }, {}),
    output: {
      dir: 'lib',
      chunkFileNames: 'esm.js',
      format: 'es',
      banner: banner
    },
    treeshake: true,
    external: ['vue', 'qs'],
    plugins: [
      // 解析第三方依赖
      resolve({
        jsnext: true,
        preferBuiltins: true,
        browser: true,
        extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx']
      }),
      // 识别 commonjs 模式第三方依赖
      commonjs(),
      // rollup 编译 typescript
      rollupTypescript(),
      // babel 配置
      babel({
        // 编译库使用 runtime
        babelHelpers: 'runtime',
        // 只转换源代码，不转换外部依赖
        exclude: 'node_modules/**',
        // babel 默认不支持 ts 需要手动添加
        extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx']
      }),
      // 解析json
      json(),
      filesize(),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  }
  return [...configs, config]
}
export default createConfigs()