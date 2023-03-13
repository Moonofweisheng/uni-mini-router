# uni-mini-router

#### 介绍

基于 uni-app 平台，提供类`vue-router`的路由，仅支持`vue3`，与[uni-read-pages-vite](https://gitee.com/fant-mini/uni-read-pages-vite)搭配使用。

## 安装

您可以使用 `Yarn` 或 `npm` 安装该软件包（选择一个）：

##### Yarn

```sh
yarn add uni-mini-router -D
```

##### npm

```sh
npm install uni-mini-router --save
```

## 开始

#### router.ts

```ts
import { createRouter } from 'uni-mini-router'
const router = createRouter({
  routes: [...ROUTES]
})
export router
```

#### main.ts

```ts
import { createSSRApp } from 'vue'
import App from './App.vue'
import { router } from './router/router'
export function createApp() {
  const app = createSSRApp(App)
  app.use(router)
  return {
    app
  }
}
```

## 使用

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'uni-mini-router'
let router = useRouter()
router.push({
  name: 'name',
})
</script>
```
#### 或者

```ts
<script setup lang="ts">
import { getCurrentInstance } from 'vue'
let instence = getCurrentInstance()
let $Router = instence?.appContext.config.globalProperties.$Router
$Router.push({
    name: 'name',
})
</script>
```