/*
 * @Author: 徐庆凯
 * @Date: 2023-03-13 15:48:09
 * @LastEditTime: 2023-03-31 14:26:22
 * @LastEditors: 徐庆凯
 * @Description:
 * @FilePath: \uni-mini-router\src\interfaces\index.ts
 * 记得注释
 */
/* eslint-disable @typescript-eslint/ban-types */

/**
 * Router instance.
 */
export interface Router {
  route: Route
  routes: any
  readonly guardHooks: GuardHooksConfig
  back(level: number | undefined): void
  push(to: RouteLocationRaw): void
  replace(to: RouteLocationRaw): void
  replaceAll(to: RouteLocationRaw): void
  pushTab(to: RouteLocationRaw): void
  beforeEach(userGuard: BeforeEachGuard): void // 全局前置路由守卫
  afterEach(userGuard: AfterEachGuard): void // 全局后置路由守卫
  install(App: any): void
}

export type BeforeEachGuard = (to: Route, from: Route, next: (rule?: Route | boolean) => void) => void // 全局前置守卫函数
export type AfterEachGuard = (to: Route, from: Route) => void // 全局后置守卫函数

export interface GuardHooksConfig {
  beforeHooks: BeforeEachGuard[]
  afterHooks: AfterEachGuard[]
}

export interface RouteLocationBase {
  animationType?: startAnimationType | endAnimationType
  animationDuration?: number
}

export type startAnimationType =
  | 'slide-in-right'
  | 'slide-in-left'
  | 'slide-in-top'
  | 'slide-in-bottom'
  | 'pop-in'
  | 'fade-in'
  | 'zoom-out'
  | 'zoom-fade-out'
  | 'none'
export type endAnimationType =
  | 'slide-out-right'
  | 'slide-out-left'
  | 'slide-out-top'
  | 'slide-out-bottom'
  | 'pop-out'
  | 'fade-out'
  | 'zoom-in'
  | 'zoom-fade-in'
  | 'none'
export interface RouteNameLocation extends RouteLocationBase {
  name: string
  params?: Object
}
export interface RoutePathLocation extends RouteLocationBase {
  path: string
  query?: object
}
export type RouteUrlLocation = string
export type RouteLocationRaw = RouteUrlLocation | RouteNameLocation | RoutePathLocation
export interface RouterOptions {
  routes: any
}

export interface Route {
  fullPath?: string
  name?: string
  path: string
  query?: Record<string, any>
}
// export interface RouteRule {
//   path: string // pages.json中的path 必须加上 '/' 开头
//   name?: string // 命名路由
//   meta?: any // 其他格外参数
//   [propName: string]: any
// }
export type NAVTYPE = 'push' | 'replace' | 'replaceAll' | 'pushTab' | 'back'
export type HookType = 'beforeHooks' | 'afterHooks'
export const NavMethod = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab', 'navigateBack']
