/*
 * @Author: 徐庆凯
 * @Date: 2023-03-13 15:48:09
 * @LastEditTime: 2023-07-06 16:07:30
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
  back(to?: RouteBackLocation): void
  push(to: RouteLocationRaw): void
  replace(to: RouteLocationRaw): void
  replaceAll(to: RouteLocationRaw): void
  pushTab(to: RouteLocationRaw): void
  beforeEach(userGuard: BeforeEachGuard): void // 全局前置路由守卫
  afterEach(userGuard: AfterEachGuard): void // 全局后置路由守卫
  install(App: any): void
}

export type BeforeEachGuard = (to: Route, from: Route, next: (rule?: NextRouteLocationRaw | boolean) => void) => void | Promise<void> // 全局前置守卫函数
export type AfterEachGuard = (to: Route, from: Route) => void // 全局后置守卫函数

export interface GuardHooksConfig {
  beforeHooks: BeforeEachGuard[] // 前置钩子
  afterHooks: AfterEachGuard[] // 后置钩子
}

export interface RouteLocationBase {
  animationType?: StartAnimationType | EndAnimationType // 动画类型
  animationDuration?: number // 动画时间
}

export type StartAnimationType =
  | 'slide-in-right'
  | 'slide-in-left'
  | 'slide-in-top'
  | 'slide-in-bottom'
  | 'pop-in'
  | 'fade-in'
  | 'zoom-out'
  | 'zoom-fade-out'
  | 'none'
export type EndAnimationType =
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
  name: string // 路由名称
  params?: Record<string, string> // 参数
}

// path与query组合
export interface RoutePathLocation extends RouteLocationBase {
  path: string // 路由路径
  query?: Record<string, string> // 参数
}

// back方法参数
export interface RouteBackLocation extends RouteLocationBase {
  animationType: EndAnimationType
  delta?: number // 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
}

export type RouteUrlLocation = string
export type RouteLocationRaw = RouteUrlLocation | RouteNameLocation | RoutePathLocation // 路由位置

// 创建路由实例的选项
export interface RouterOptions {
  routes: any
}

// 路由信息
export interface Route {
  fullPath?: string
  aliasPath?: string
  name?: string
  path?: string
  query?: Record<string, any>
  params?: Record<string, any>
}
// 导航类型
export type NAVTYPE = 'push' | 'replace' | 'replaceAll' | 'pushTab' | 'back'
export type NavMethodType = 'navigateTo' | 'redirectTo' | 'reLaunch' | 'switchTab' | 'navigateBack'

// 导航类型枚举
export enum NavTypeEnum {
  push = 'navigateTo',
  replace = 'redirectTo',
  replaceAll = 'reLaunch',
  pushTab = 'switchTab',
  back = 'navigateBack'
}

// 导航类型枚举反向映射
// export enum NavTypeReverseEnum {
//   navigateTo = 'push',
//   redirectTo = 'replace',
//   reLaunch = 'replaceAll',
//   switchTab = 'pushTab',
//   navigateBack = 'back'
// }
export type HookType = 'beforeHooks' | 'afterHooks'
export const NavMethod: NavMethodType[] = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab', 'navigateBack']

// next方法
// name与params组合
export interface NextRouteNameLocation extends RouteNameLocation {
  navType?: NAVTYPE // 导航类型
}

// path与query组合
export interface NextRoutePathLocation extends RoutePathLocation {
  navType?: NAVTYPE // 导航类型
}

// back方法参数
export interface NextRouteBackLocation extends RouteBackLocation {
  navType?: NAVTYPE // 导航类型
}

// Next方法入参
export type NextRouteLocationRaw = RouteUrlLocation | NextRouteNameLocation | NextRoutePathLocation | NextRouteBackLocation
