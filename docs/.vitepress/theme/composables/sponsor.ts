/*
 * @Author: weisheng
 * @Date: 2023-08-01 11:12:05
 * @LastEditTime: 2023-08-01 21:16:30
 * @LastEditors: weisheng
 * @Description: 
 * @FilePath: \wot-design-uni\docs\.vitepress\theme\composables\sponsor.ts
 * 记得注释
 */
import { ref, onMounted } from 'vue'


const data = ref()

export function useSponsor() {
  onMounted(async () => {
    if (data.value) {
      return
    }
    const result = await fetch('https://fant-mini-plus.top/sponsors/wot-design-uni.json')
    const json = await result.json()
    data.value = json
  })

  return {
    data,
  }
}



