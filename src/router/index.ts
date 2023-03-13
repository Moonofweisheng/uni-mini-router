/*
 * @Author: 徐庆凯
 * @Date: 2023-03-13 15:56:28
 * @LastEditTime: 2023-03-13 19:15:10
 * @LastEditors: 徐庆凯
 * @Description:
 * @FilePath: \uni-mini-router\src\router\index.ts
 * 记得注释
 */

import qs from 'qs'
import { NAVTYPE, RouteLocationRaw, Router } from '../interfaces'

/**
 * 跳转至指定路由
 * @param to 目标路径
 * @param router router实例
 * @param navType 跳转类型
 * @returns
 */
export function navjump(to: RouteLocationRaw, router: Router, navType: NAVTYPE) {
  const url: string = getRoutePath(to, router)
  switch (navType) {
    case 'push':
      uni.navigateTo({ url: url })
      break
    case 'replace':
      uni.redirectTo({ url: url })
      break
    case 'pushTab':
      uni.switchTab({ url: url })
      break
    case 'replaceAll':
      uni.reLaunch({ url: url })
      break
    default:
      throw new Error('路由类型不正确')
  }
  return
}

/**
 * 获取目标路径
 * @param to 目标页面
 * @param router
 * @returns
 */
function getRoutePath(to: RouteLocationRaw, router: Router): string {
  let url: string = '' // 路径
  let query: Record<string, any> = {}
  if (typeof to === 'string') {
    url = to
  } else {
    if ((to as any).name) {
      const route = router.routes.find((route: { name: any }) => {
        return route.name === (to as any).name
      })
      if (route && route.path) {
        url = route.path
      } else {
        throw new Error('当前路由表匹配规则已全部匹配完成，未找到满足的匹配规则。')
      }
      query = (to as any).params
    } else {
      url = (to as any).path
      query = (to as any).query
    }
    if (query) {
      url = url + qs.stringify(query)
    }
  }
  return url
}
