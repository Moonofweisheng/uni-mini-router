/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: 徐庆凯
 * @Date: 2023-03-13 15:56:28
 * @LastEditTime: 2023-04-03 22:50:29
 * @LastEditors: 徐庆凯
 * @Description:
 * @FilePath: \uni-mini-router\src\router\index.ts
 * 记得注释
 */

import qs from 'qs'
import { AfterEachGuard, BeforeEachGuard, HookType, NavMethod, NAVTYPE, Route, RouteLocationRaw, Router } from '../interfaces'

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
      const route = router.routes.find((item: { name: any }) => {
        return item.name === (to as any).name
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

/**
 * 获取当前页面
 * @returns 当前页面
 */
export function getCurrentPage() {
  const pages = getCurrentPages()
  return pages.length > 0 ? pages[pages.length - 1] : undefined
}

/**
 * 保存路由元信息到路由实例
 * @param router 路由实例
 * @param query 路由参数
 * @returns
 */
export function saveCurrRouteByCurrPage(router: Router) {
  const currRoute: Route = getCurrentPageRoute(router)
  router.route = currRoute
}

/**
 * 获取当前页面的路由元信息
 * @param router router实例
 * @returns
 */
export function getCurrentPageRoute(router: Router): Route {
  const page = getCurrentPage()
  if (!page || !page.route || !router.routes) {
    return
  }
  const currRoute: Route = getRouteByPath(`/${page.route}`, router)
  return currRoute
}

/**
 * 通过页面路路径寻找路由元信息
 * @param path 页面路径
 * @param router 路由实例
 * @returns 路由元信息
 */
export function getRouteByPath(path: string, router: Router): Route {
  path = path.split('?')[0]
  const route: Route = router.routes.find((route: { path: string }) => {
    return route.path === path
  })
  return route
}

/**
 * 注册守卫钩子
 * @param router 路由实例
 * @param hookType 钩子类型
 * @param userGuard 守卫
 */
export function registerEachHooks(router: Router, hookType: HookType, userGuard: BeforeEachGuard | AfterEachGuard) {
  router.guardHooks[hookType] = [userGuard as any]
}
// 保留uni默认的NavMethod
const oldMethods: Record<string, Function> = {
  navigateTo: uni.navigateTo,
  redirectTo: uni.redirectTo,
  reLaunch: uni.reLaunch,
  switchTab: uni.switchTab,
  navigateBack: uni.navigateBack
}

/**
 * 重写uni路由相关事件
 */
export function rewriteNavMethod(router: Router) {
  NavMethod.forEach((name) => {
    ;(uni as any)[name] = function (options: any) {
      if (name === 'navigateBack') {
        oldMethods[name](options)
      } else {
        if (router.guardHooks.beforeHooks && router.guardHooks.beforeHooks[0]) {
          const to: Route = getRouteByPath(options.url, router)
          guardToPromiseFn(router.guardHooks.beforeHooks[0], to, router.route)
            .then((resp: any) => {
              if (resp && resp.to) {
                const path = getRoutePath(resp.to, router)
                if (path && path !== options.url) {
                  oldMethods[name]({ url: path })
                } else {
                  oldMethods[name](options)
                }
              } else {
                oldMethods[name](options)
              }
            })
            .catch((error) => {
              throw error
            })
        }
      }
    }
  })
}

/**
 * 用Promise处理守卫方法
 * @param guard 守卫
 * @param to 目标路由
 * @param from 来源路由
 * @returns
 */
export function guardToPromiseFn(guard: BeforeEachGuard, to: Route, from: Route) {
  return new Promise((reslove, reject) => {
    const next: ((rule?: Route | boolean) => void) | any = (rule?: Route | boolean) => {
      next._called = true
      if (rule === false) {
        reject({})
      } else if (rule === undefined) {
        reslove({ to: to })
      } else {
        reslove({ to: rule })
      }
    }
    const guardReturn = guard.call(undefined, to, from, next)
    let guardCall = Promise.resolve(guardReturn)
    if (guard.length < 3) guardCall = guardCall.then(next)
    if (guard.length > 2) {
      if (!next._called) {
        const message = `The "next" callback was never called inside of ${
          guard.name ? '"' + guard.name + '"' : ''
        }:\n${guard.toString()}\n. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`
        console.warn(message)
        reject(new Error('Invalid navigation guard'))
        return
      }
    }
    guardCall.catch((err) => reject(err))
  })
}
