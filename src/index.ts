/*
 * @Author: 徐庆凯
 * @Date: 2023-03-13 15:48:09
 * @LastEditTime: 2023-04-27 13:10:08
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-router\src\index.ts
 * 记得注释
 */
import { routeKey, routerKey } from './symbols'
import { getCurrentPageRoute, navjump, registerEachHooks, rewriteNavMethod, saveCurrRouteByCurrPage } from './router'
import type { AfterEachGuard, BeforeEachGuard, Route, RouteLocationRaw, Router, RouterOptions } from './interfaces/index'
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
    back(level: number = 1) {
      return uni.navigateBack({ delta: level })
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
            saveCurrRouteByCurrPage(router)
            if (router.guardHooks.afterHooks && router.guardHooks.afterHooks[0]) {
              const from: Route = router.route.value
              const to: Route = getCurrentPageRoute(router) // 当前页面路由信息
              router.guardHooks.afterHooks[0].call(null, to, from)
            }
          }
        },
        onLoad(option: Record<string, any> | undefined) {
          const query: Record<string, any> | undefined = router.route.value.query // query
          const params: Record<string, any> | undefined = router.route.value.params // params
          if (!isEmptyObject(option) && isEmptyObject(query) && isEmptyObject(params)) {
            router.route.value = { ...router.route.value, query: option }
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
