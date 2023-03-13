import type { InjectionKey } from 'vue'
import type { Router } from '../interfaces'

/**
 * useRouter 用到的key
 *
 * @internal
 */
export const routerKey = Symbol('__ROUTER__') as InjectionKey<Router>
