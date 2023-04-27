/*
 * @Author: 徐庆凯
 * @Date: 2023-03-13 15:48:09
 * @LastEditTime: 2023-04-27 15:52:35
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-router\src\interfaces\index.ts
 * 记得注释
 */
/* eslint-disable @typescript-eslint/ban-types */

import { Ref } from 'vue'

/**
 * Router instance.
 */
export interface Router {
  route: Ref<Route> // 当前路由信息
  routes: any // 路由表
  readonly guardHooks: GuardHooksConfig // 守卫钩子
  back(level?: number): void
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
  beforeHooks: BeforeEachGuard[] // 前置钩子
  afterHooks: AfterEachGuard[] // 后置钩子
}

export interface RouteLocationBase {
  animationType?: startAnimationType | endAnimationType // 动画类型
  animationDuration?: number // 动画时间
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

// name与params组合
export interface RouteNameLocation extends RouteLocationBase {
  name: string
  params?: Record<string, string>
}

// path与query组合
export interface RoutePathLocation extends RouteLocationBase {
  path: string
  query?: Record<string, string>
}
export type RouteUrlLocation = string
export type RouteLocationRaw = RouteUrlLocation | RouteNameLocation | RoutePathLocation

// 创建路由实例的选项
export interface RouterOptions {
  routes: any
}

// 路由信息
export interface Route {
  fullPath?: string
  name?: string
  path?: string
  query?: Record<string, any>
  params?: Record<string, any>
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
