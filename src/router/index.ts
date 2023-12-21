/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: 徐庆凯
 * @Date: 2023-03-13 15:56:28
 * @LastEditTime: 2023-12-21 21:37:34
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-router\src\router\index.ts
 * 记得注释
 */

import {
  AfterEachGuard,
  BeforeEachGuard,
  HookType,
  NavMethod,
  NAVTYPE,
  NavTypeEnum,
  NextRouteBackLocation,
  NextRouteLocationRaw,
  Route,
  RouteLocationRaw,
  Router
} from '../interfaces'

import { beautifyUrl, getUrlParams, queryStringify, setUrlParams } from '../utils'

// 保留uni默认的NavMethod
const navMethods: Record<string, Function> = {
  navigateTo: uni.navigateTo,
  redirectTo: uni.redirectTo,
  reLaunch: uni.reLaunch,
  switchTab: uni.switchTab,
  navigateBack: uni.navigateBack
}

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
      navMethods.navigateTo({ url: url })
      break
    case 'replace':
      navMethods.redirectTo({ url: url })
      break
    case 'pushTab':
      navMethods.switchTab({ url: url })
      break
    case 'replaceAll':
      navMethods.reLaunch({ url: url })
      break
    default:
      throw new Error('无效的路由类型，请确保提供正确的路由类型')
    // throw new Error('Invalid route type provided. Please ensure the provided route is of the correct type.')
  }
  return
}

/**
 * 获取目标路径
 * @param to 目标页面
 * @param router
 * @returns
 */
export function getRoutePath(to: RouteLocationRaw, router: Router): string {
  let url: string = '' // 路径
  let query: Record<string, string> = {}
  if (typeof to === 'string') {
    url = to
  } else {
    if ((to as any).name) {
      // 通过name匹配路由
      const route = router.routes.find((item: { name: string }) => {
        return item.name === (to as any).name
      })
      if (route && route.path) {
        url = route.path
      } else {
        throw new Error('您正在尝试访问的路由未在路由表中定义。请检查您的路由配置。')
        // throw new Error('The route you are trying to access is not defined in the routing table. Please check your routing configuration.')
      }
      query = (to as any).params
    } else if ((to as any).path) {
      url = beautifyUrl(`/${(to as any).path.split('?')[0]}`)
      query = { ...getUrlParams((to as any).path), ...((to as any).query || {}) }
    }
    if (query) {
      query = queryStringify(query)
      url = setUrlParams(url, query)
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
 * 保存路由信息到路由实例
 * @param router 路由实例
 * @param query 路由参数
 * @returns
 */
export function saveCurrRouteByCurrPage(router: Router) {
  router.route.value = getCurrentPageRoute(router)
}

/**
 * 获取当前页面的路由信息
 * @param router router实例
 * @returns
 */
export function getCurrentPageRoute(router: Router): Route {
  const page: any = getCurrentPage()
  if (!page || !page.route || !router.routes) {
    return
  }
  const currRoute: Route = getRouteByPath(`/${page.route}`, router)
  if (page.$page) {
    currRoute.fullPath = page.$page.fullPath ? page.$page.fullPath : ''
    currRoute.query = page.$page.fullPath ? getUrlParams(page.$page.fullPath) : {}
    currRoute.params = page.$page.fullPath ? getUrlParams(page.$page.fullPath) : {}
  }

  return currRoute
}

/**
 * 通过页面路路径寻找路由信息
 * @param path 页面路径
 * @param router 路由实例
 * @returns 路由信息
 */
export function getRouteByPath(path: string, router: Router): Route {
  path = beautifyUrl(path.split('?')[0])
  const route: Route = router.routes.find((route: Route) => {
    return route.path === path || route.aliasPath === path
  })
  return JSON.parse(JSON.stringify(route))
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
    navMethods[name] = function (options: any) {
      if (name === 'navigateBack') {
        oldMethods[name](options)
      } else {
        if (router.guardHooks.beforeHooks && router.guardHooks.beforeHooks[0]) {
          const to: Route = getRouteByPath(options.url, router)
          guardToPromiseFn(router.guardHooks.beforeHooks[0], to, router.route.value)
            .then((resp) => {
              if (resp === true) {
                oldMethods[name](options)
              } else {
                if (typeof resp === 'string') {
                  const url: string = getRoutePath(resp, router)
                  oldMethods[name]({ url: url })
                } else if ((resp as NextRouteBackLocation).navType === 'back') {
                  oldMethods['navigateBack'](resp)
                } else {
                  const url: string = getRoutePath(resp as RouteLocationRaw, router)
                  oldMethods[resp.navType ? NavTypeEnum[resp.navType] : name]({ url: url })
                }
              }
            })
            .catch((error) => {
              throw error
            })
        } else {
          oldMethods[name](options)
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
  return new Promise<NextRouteLocationRaw | true>((reslove, reject) => {
    const next: ((rule?: NextRouteLocationRaw | boolean) => void) | any = (rule?: NextRouteLocationRaw | boolean) => {
      next._called = true
      if (rule === false) {
        reject({})
      } else if (rule === undefined || rule === true) {
        reslove(true)
      } else {
        reslove(rule)
      }
    }
    const guardReturn = guard.call(undefined, to, from, next)
    let guardCall = Promise.resolve(guardReturn)
    if (guard.length < 3) guardCall = guardCall.then(next)
    if (guard.length > 2) {
      const message = `The "next" callback was never called inside of ${
        guard.name ? '"' + guard.name + '"' : ''
      }:\n${guard.toString()}\n. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`
      if (guardReturn !== null && typeof guardReturn === 'object' && 'then' in guardReturn!) {
        guardCall = guardCall.then((resolvedValue) => {
          if (!next._called) {
            console.warn(message)
            return Promise.reject(new Error('Invalid navigation guard'))
          }
          return resolvedValue
        })
      } else {
        if (!next._called) {
          console.warn(message)
          reject(new Error('Invalid navigation guard'))
          return
        }
      }
    }
    guardCall.catch((err) => reject(err))
  })
}
