/*
 * @Author: weisheng
 * @Date: 2023-03-13 17:01:30
 * @LastEditTime: 2023-04-26 21:51:51
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-router\src\symbols\index.ts
 * 记得注释
 */
import type { InjectionKey, Ref } from 'vue'
import type { Route, Router } from '../interfaces'

/**
 * useRouter 用到的key
 *
 * @internal
 */
export const routerKey = Symbol('__ROUTER__') as InjectionKey<Router>

/**
 * useRoute 用到的key
 *
 * @internal
 */
export const routeKey = Symbol('__ROUTE__') as InjectionKey<Ref<Route>>
