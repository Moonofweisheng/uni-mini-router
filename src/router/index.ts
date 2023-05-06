/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: 徐庆凯
 * @Date: 2023-03-13 15:56:28
 * @LastEditTime: 2023-05-06 20:06:00
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-router\src\router\index.ts
 * 记得注释
 */

import { AfterEachGuard, BeforeEachGuard, HookType, NavMethod, NAVTYPE, Route, RouteLocationRaw, Router } from '../interfaces'

import { beautifyUrl, getUrlParams, queryStringify, setUrlParams } from '../utils'

/**
 * 跳转至指定路由
 * @param to 目标路径
 * @param router router实例
 * @param navType 跳转类型
 * @returns
 */
export function navjump(to: RouteLocationRaw, router: Router, navType: NAVTYPE) {
  const url: string = getRoutePath(to, router)
  // 修改路由表中路由信息
  modifyRoute(to, router)
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
      throw new Error('无效的路由类型，请确保提供正确的路由类型')
    // throw new Error('Invalid route type provided. Please ensure the provided route is of the correct type.')
  }
  return
}

/**
 * 修改路由信息
 * @param to 目标路由
 * @param router 路由实例
 */
function modifyRoute(to: RouteLocationRaw, router: Router) {
  let path: string = '' // 路由路径
  if (typeof to === 'string') {
    path = beautifyUrl(`/${to.split('?')[0]}`)
    // 通过path匹配路由
    router.routes.forEach((item: { query: Record<string, any>; path: string }) => {
      if (item.path === path) {
        item.query = getUrlParams(to)
      }
    })
  } else if ((to as any).name) {
    // 通过name匹配路由
    router.routes.forEach((item: { params: any; name: any }) => {
      if (item.name === (to as any).name) {
        item.params = (to as any).params
      }
    })
  } else if ((to as any).path) {
    path = beautifyUrl(`/${(to as any).path.split('?')[0]}`)
    // 通过path匹配路由
    router.routes.find((item: { query: any; path: string }) => {
      if (item.path === path) {
        item.query = { ...getUrlParams((to as any).path), ...((to as any).query || {}) }
      }
    })
  }
}

/**
 * 获取目标路径
 * @param to 目标页面
 * @param router
 * @returns
 */
function getRoutePath(to: RouteLocationRaw, router: Router): string {
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
  const currRoute: Route = getCurrentPageRoute(router)
  router.route.value = JSON.parse(JSON.stringify(currRoute))
  delete currRoute.params
  delete currRoute.query
}

/**
 * 获取当前页面的路由信息
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
 * 通过页面路路径寻找路由信息
 * @param path 页面路径
 * @param router 路由实例
 * @returns 路由信息
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
          guardToPromiseFn(router.guardHooks.beforeHooks[0], to, router.route.value)
            .then((resp: any) => {
              if (resp && resp.to) {
                const path = getRoutePath(resp.to, router)
                if (path && path !== options.url.split('?')[0]) {
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
