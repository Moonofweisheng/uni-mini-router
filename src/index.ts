/*
 * @Author: 徐庆凯
 * @Date: 2023-03-13 15:48:09
 * @LastEditTime: 2023-03-13 19:07:59
 * @LastEditors: 徐庆凯
 * @Description:
 * @FilePath: \uni-mini-router\src\index.ts
 * 记得注释
 */
import { routerKey } from './symbols'
import { navjump } from './router'
import type { RouteLocationRaw, Router, RouterOptions } from './interfaces/index'
/**
 * Creates a Router instance that can be used by a Vue app.
 *
 */
export function createRouter(options: RouterOptions): Router {
  const router: Router = {
    routes: options.routes,
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
    install: function (app: any): void {
      const router = this
      app.provide(routerKey, this)
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
    route: {}
  }
  return router
}

export * from './core'
