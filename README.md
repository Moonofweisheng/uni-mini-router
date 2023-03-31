# uni-mini-router

#### 介绍

基于 uni-app 平台，提供类`vue-router`的路由，仅支持`vue3`，需要与[uni-read-pages-vite](https://gitee.com/fant-mini/uni-read-pages-vite)搭配使用。

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


### 导航守卫  

`uni-mini-router`支持`全局前置导航守卫 beforeEach`和`全局后置导航守卫 afterEach`，主要用来通过跳转或取消的方式守卫导航。

#### 全局前置守卫 beforeEach 
你可以使用 `router.beforeEach` 注册一个全局前置守卫：

```ts 
const router = createRouter({ ... })

router.beforeEach((to, from, next) => {
  // next入参 false 以取消导航
  next(false)
})
```
##### `beforeEach`守卫方法接收三个参数：
- `to`: 即将要进入的目标
- `from`: 当前导航正要离开的路由
- `next`: 用于reslove `beforeEach`钩子，需要确保 `next` 在导航守卫中都被严格调用一次- 
  - `next()`: 执行默认路由跳转逻辑
  - `next(false)`: 终止跳转逻辑
  - `next({ path: '/' })`: 跳转到不同的页面

#### 全局后置钩子 afterEach
你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身

```ts 
const router = createRouter({ ... })

router.afterEach((to, from) => {
  console.log(to)
  console.log(from)
})
```
它对于分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用。

