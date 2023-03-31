/*
 * @Author: 徐庆凯
 * @Date: 2023-03-13 15:48:09
 * @LastEditTime: 2023-03-31 14:19:30
 * @LastEditors: 徐庆凯
 * @Description:
 * @FilePath: \uni-mini-router\src\index.ts
 * 记得注释
 */
import { routerKey } from './symbols'
import { getCurrentPageRoute, navjump, registerEachHooks, rewriteNavMethod, saveCurrRouteByCurrPage } from './router'
import type { NavigationGuard, Route, RouteLocationRaw, Router, RouterOptions } from './interfaces/index'
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
    back(level: number = 1) {
      return uni.navigateBack({ delta: level })
    },
    beforeEach(userGuard: NavigationGuard) {
      registerEachHooks(router, 'beforeHooks', userGuard)
    },
    afterEach(userGuard: NavigationGuard) {
      registerEachHooks(router, 'afterHooks', userGuard)
    },
    install: function (app: any): void {
      const router = this
      app.provide(routerKey, this)
      rewriteNavMethod(router)
      app.mixin({
        beforeCreate() {
          if (this.$mpType === 'page') {
            if (router.guardHooks.afterHooks && router.guardHooks.afterHooks[0]) {
              const from: Route = router.route
              const to: Route = getCurrentPageRoute(router)
              saveCurrRouteByCurrPage(router)
              router.guardHooks.afterHooks[0].call(null, to, from)
            }
          }
        }
      })
      Object.defineProperty(app.config.globalProperties, '$Router', {
        get() {
          return router
        }
      })
      Object.defineProperty(app.config.globalProperties, '$Route', {
        get() {
          return router.route
        }
      })
    },
    route: { path: '/' }
  }
  return router
}

export * from './core'
