/*
 * @Author: 徐庆凯
 * @Date: 2023-03-13 19:02:05
 * @LastEditTime: 2023-03-13 19:02:26
 * @LastEditors: 徐庆凯
 * @Description:
 * @FilePath: \uni-mini-router\src\core\index.ts
 * 记得注释
 */
import type { Router } from '../interfaces'
import { inject } from 'vue'
import { routerKey } from '../symbols'
/**
 * 返回router实例，在template的仍然可以使用$Router方法
 */
export function useRouter(): Router {
  return inject(routerKey)!
}
