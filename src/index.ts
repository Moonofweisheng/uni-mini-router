/*
 * @Author: 徐庆凯
 * @Date: 2023-03-13 15:48:09
 * @LastEditTime: 2023-05-29 14:51:18
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-router\src\index.ts
 * 记得注释
 */
import { routeKey, routerKey } from './symbols'
import { getCurrentPageRoute, navjump, registerEachHooks, rewriteNavMethod, saveCurrRouteByCurrPage } from './router'
import type { AfterEachGuard, BeforeEachGuard, Route, RouteBackLocation, RouteLocationRaw, Router, RouterOptions } from './interfaces'
import { shallowRef, unref } from 'vue'
import { isEmptyObject } from './utils'
/**
 * Creates a Router instance that can be used by a Vue app.
 *
 */
export function createRouter(options: RouterOptions): Router {
  const router: Router = {
    routes: options.routes,
    guardHooks: {
      beforeHooks: null,
      afterHooks: null
    },
    push(to: RouteLocationRaw) {
      return navjump(to, this, 'push')
    },
    replace(to: RouteLocationRaw) {
      return navjump(to, this, 'replace')
    },
    replaceAll(to: RouteLocationRaw) {
      return navjump(to, this, 'replaceAll')
    },
    pushTab(to: RouteLocationRaw) {
      return navjump(to, this, 'pushTab')
    },
    back(to?: RouteBackLocation) {
      return uni.navigateBack(to)
    },
    beforeEach(userGuard: BeforeEachGuard) {
      registerEachHooks(router, 'beforeHooks', userGuard)
    },
    afterEach(userGuard: AfterEachGuard) {
      registerEachHooks(router, 'afterHooks', userGuard)
    },
    install: function (app: any): void {
      const router = this
      app.provide(routerKey, this)
      app.provide(routeKey, this.route)
      rewriteNavMethod(router)
      app.mixin({
        beforeCreate() {
          if (this.$mpType === 'page') {
            if (router.guardHooks.afterHooks && router.guardHooks.afterHooks[0]) {
              const from: Route = router.route.value
              const to: Route = getCurrentPageRoute(router) // 当前页面路由信息
              router.guardHooks.afterHooks[0].call(null, to, from)
            }
          }
        },
        onLoad(option: Record<string, any> | undefined) {
          if (!isEmptyObject(option) && isEmptyObject(router.route.value.query) && isEmptyObject(router.route.value.params)) {
            router.route.value = { ...router.route.value, query: option }
          }
        },
        onShow() {
          if (this.$mpType === 'page') {
            saveCurrRouteByCurrPage(router)
          }
        }
      })
      Object.defineProperty(app.config.globalProperties, '$Router', {
        get() {
          return router
        }
      })
      Object.defineProperty(app.config.globalProperties, '$Route', {
        enumerable: true,
        get: () => unref(this.route)
      })
    },
    route: shallowRef<Route>({ path: '/' })
  }
  return router
}

export * from './core'
export * from './interfaces'
