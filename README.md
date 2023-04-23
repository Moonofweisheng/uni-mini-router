# uni-mini-router

#### 介绍

基于 uni-app 平台，提供类`vue-router`的路由，仅支持`vue3`，需要与[uni-read-pages-vite](https://gitee.com/fant-mini/uni-read-pages-vite)搭配使用。`uni-read-pages-vite`用于获取路由表。

## 安装uni-mini-router


##### Yarn

```sh
yarn add uni-mini-router -D
```

##### npm

```sh
npm install uni-mini-router --save
```

## 安装uni-read-pages-vite
##### Yarn

```sh
yarn add uni-read-pages-vite
```
##### npm

```sh
npm install uni-read-pages-vite
```


## 开始

### 配置uni-read-pages-vite
配置 `vite.config.ts` 通过 `define` 注入全局变量 [查看文档](https://cn.vitejs.dev/config/shared-options.html#define)

####  `vite.config.ts`
```ts
//vite.config.ts
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import TransformPages from 'uni-read-pages-vite'
const transformPages = new TransformPages()

export default defineConfig({
  plugins: [uni()],
  define: {
    ROUTES: transformPages.routes, // 注入路由表
  }
});
```

#### 声明文件`type.d.ts`
`.d.ts`文件的作用是描述`JavaScript`库、模块或其他代码的类型声明和元数据，以便编辑器和开发者能够更好地理解和使用该代码。在编译时，`TypeScript`编译器会使用`.d.ts`文件来验证代码正确性，并帮助开发者在开发过程中提供更好的代码提示和自动补全功能。

```ts
//type.d.ts
declare const ROUTES: []
```

### 配置uni-mini-router
项目根目录下创建router文件夹，并在该文件夹创建index.ts

#### router/index.ts
此处的ROUTES就是[这里注入的](#`vite.config.ts`)
```ts
import { createRouter } from 'uni-mini-router'
const router = createRouter({
  routes: [...ROUTES] // 路由表信息
})
export default router
```

#### main.ts

```ts
import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './router'
export function createApp() {
  const app = createSSRApp(App)
  app.use(router)
  return {
    app
  }
}
```

## 使用

### 编程式导航

>注意：这里`name` 和 `params`搭配使用，而`path` 可以与 `query` 一起使用。

#### 基础用法

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'uni-mini-router'
import { getCurrentInstance } from 'vue'

// 使用hooks（推荐）
let router = useRouter()

// 或者 使用全局挂载的router
router = instence?.appContext.config.globalProperties.$Router

// 字符串路径
router.push('/user')

// 带有路径的对象
router.push({ path: '/user' })

// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })

// 带查询参数，结果是 /user?username=eduardo
router.push({ path: '/user', query: { username: 'eduardo' } })

</script>
```

在user.vue接收传入的对象参数
```ts
<script setup lang="ts">
onLoad((option) => {
  if (option && option.username) {
    const username = option.username
  }
})
</script>
```
#### 传递对象参数
url有长度限制，太长的字符串会传递失败，可改用[窗体通信](https://uniapp.dcloud.net.cn/tutorial/page.html#%E9%A1%B5%E9%9D%A2%E9%80%9A%E8%AE%AF)、[全局变量](https://ask.dcloud.net.cn/article/35021)，另外参数中出现空格等特殊字符时需要对参数进行编码，如下为使用encodeURIComponent对参数进行编码的示例。

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'uni-mini-router'
import { getCurrentInstance } from 'vue'

let router = useRouter()

const user = {
  name:'小星星',
  label:"小熊熊"
}

// 命名的路由，传递对象参数
router.push({ name: 'user', params: { user: encodeURIComponent(JSON.stringify(item)) } })

// path+query，传递对象参数
router.push({ path: '/user', query: { user: encodeURIComponent(JSON.stringify(item)) } })

</script>
```
在user.vue接收传入的对象参数
```ts
<script setup lang="ts">
onLoad((option) => {
  if (option && option.user) {
    const user = JSON.parse(decodeURIComponent(option.user))
  }
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

