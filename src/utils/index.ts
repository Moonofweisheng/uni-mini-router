/*
 * @Author: weisheng
 * @Date: 2023-04-23 13:19:59
 * @LastEditTime: 2023-04-27 12:45:37
 * @LastEditors: weisheng
 * @Description:url工具
 * @FilePath: \uni-mini-router\src\utils\index.ts
 * 记得注释
 */
/**
 * 获取url中的参数
 * @param path 完整路径
 * @returns
 */
export function getUrlParams(path: string) {
  const params: Record<string, string> = {}
  const pathArray: string[] = path.split('?') // 路径根据？拆分为2部分
  let paramString: string = '' // 参数字符串
  let paramArrary: string[] = [] // 参数数组
  if (pathArray.length > 1) {
    paramString = pathArray[1]
  }
  paramArrary = paramString.split('&')
  for (let index = 0; index < paramArrary.length; index++) {
    if (paramArrary[index].split('=').length === 2) {
      params[paramArrary[index].split('=')[0]] = paramArrary[index].split('=')[1]
    }
  }
  return params
}

/**
 * 设置参数
 * @param path 路径（无参数）
 * @param params （参数）
 * @returns
 */
export function setUrlParams(path: string, params: Record<string, string>) {
  for (const key in params) {
    if (path.indexOf('?') > -1) {
      path = path + `&${key}=${params[key]}`
    } else {
      path = path + `?${key}=${params[key]}`
    }
  }
  return path
}

/**
 * 全量替换url中的字符
 * @param str 原始字符串
 * @param find 要查找的字符串
 * @param replace 要替换的字符串
 * @returns
 */
function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(find, 'g'), replace)
}

/**
 * 去除拼接url产生的多余的/
 * @param url 目标路径
 */
export function beautifyUrl(url: string) {
  url = replaceAll(url, '//', '/') // 先替换所有'//'为'/'
  url = replaceAll(url, 'https:/', 'https://') // 再将https补全'//'
  url = replaceAll(url, 'http:/', 'http://') // 再将http补全'//'
  return url
}
/**
 * url查询参数序列化
 * @param query url查询参数
 * @returns
 */
export function queryStringify(query: Record<string, string>) {
  const result: Record<string, string> = {}
  if (query) {
    for (const key in query) {
      let value: any = query[key]
      if (value === undefined) {
        value = ''
      }
      result[key] = value
    }
  }
  return result
}

/**
 * 判断query或params是否为空或者undefined
 * @param obj 待判断对象
 * @returns
 */
export function isEmptyObject(obj: undefined | null | Record<string, any>): boolean {
  return obj === undefined || obj === null || Object.keys(obj).length === 0
}
