# 快速上手
本节介绍如何在`uni-app`项目中配置并使用 `Uni Mini Router`。


## 配置路由
项目src目录下（HbuilderX创建的项目可以在根目录下）创建router文件夹，并在该文件夹创建`index.ts`，可以根据生成路由表方式的不同，我们这里也提供了两种配置router的方式，也是二选一


### 方式1：uni-parse-pages
```ts
import { createRouter } from 'uni-mini-router'
// 导入pages.json
import pagesJson from '../pages.json'
// 引入uni-parse-pages
import pagesJsonToRoutes from 'uni-parse-pages'
// 生成路由表
const routes = pagesJsonToRoutes(pagesJson)
const router = createRouter({
  routes: [...routes] // 路由表信息
})
export default router
```

### 方式2：uni-read-pages-vite

```ts
import { createRouter } from 'uni-mini-router'
const router = createRouter({
  routes: [...ROUTES] // 路由表信息
})
export default router
```

## 配置main.ts

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

## 配置pages.json
在pages.json中为页面路由指定`name`字段后，即可以使用`name`跳转
>注意：此处定义的`name`字段必须全局唯一。
```json
//  pages.json
{
  "pages": [{
      "path": "pages/home/Home",
      "name": "home", // 路由 name 用于命名路由的跳转
      "style": {
        "mp-alipay": {
          "allowsBounceVertical": "NO"
        },
        "navigationBarTitleText": "首页"
      }
    },
    {
      "path": "pages/login/Login",
      "name": "login",
      "style": {
        "mp-alipay": {
          "allowsBounceVertical": "NO"
        },
        "navigationBarTitleText": ""
      }
    },
    {
      "path": "pages/mine/Mine",
      "name": "mine",
      "style": {
        "navigationBarTitleText": "",
        "navigationBarBackgroundColor": "#E7F0FF"
      }
    }
  ],
  "tabBar": {
    "color": "#bfbfbf",
    "selectedColor": "#0165FF",
    "backgroundColor": "#ffffff",
    "list": [{
        "pagePath": "pages/home/Home",
        "iconPath": "static/icon_home.png",
        "selectedIconPath": "static/icon_home_selected.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/mine/Mine",
        "iconPath": "static/icon_mine.png",
        "selectedIconPath": "static/icon_mine_selected.png",
        "text": "我的"
      }
    ]
  },
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarBackgroundColor": "#FFF",
    "backgroundColor": "#F8F8F8"
  }
}
```
## 配置自动按需导入（可选）
[unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)：是一个为 `Vite`、`Webpack`、`Rollup` 和 `esbuild` 按需自动导入 API，支持 `TypeScript`的插件，我们基于此插件实现自动按需导入。 

不使用按需导入，则需要手动`import`
```ts
import { useRouter } from 'uni-mini-router'
const router = useRouter()
router.push('/')
```

使用按需导入后
```ts
const router = useRouter()
router.push('/')
```

### 安装`unplugin-auto-import`
```sh
yarn add uni-mini-router -D
```

### 配置`unplugin-auto-import`
详细配置方案见[unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)，这里给出支持`uni-mini-router`的简易配置
```ts
//vite.config.ts
import { defineConfig } from 'vite'
import TransformPages from 'uni-read-pages-vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
export default defineConfig({
  base: './',
  plugins: [
    uni(),
    AutoImport({
      imports: [
        'vue',
        'uni-app',
        'pinia',
        {
          from: 'uni-mini-router',
          imports: ['createRouter', 'useRouter', 'useRoute']
        }
      ],
      dts: 'src/auto-imports.d.ts', // 这里src目录必须是已存在的，如果是HbuilderX创建的项目是没有src目录的，可以配置为 dts: 'auto-imports.d.ts'
      eslintrc: {
        enabled: true,
        globalsPropValue: true
      }
    })
  ],
  define: {
    ROUTES: new TransformPages().routes
  }
})
```
#### 总结
`unplugin-auto-import` 可以帮助我们实现按需自动导入第三方库的API，提升开发效率，但是它也同样存在一些缺点，例如：
- 可能会影响代码可读性：自动导入模块可能会导致代码可读性降低，因为开发者可能不知道哪些模块被自动导入了。

- 可能会导致性能问题：自动导入模块可能会导致性能问题，因为它需要扫描整个代码库来查找缺失的模块。

所以在提升开发效率的同时也要兼顾可读性和性能问题，尽量将一些被广泛认知和使用、不用关注实现、不变的内容作为自动按需引入的对象，而项目内的代码如果自动按需引入是否会增加开发人员的心智负担，则需要我们做出相应的权衡。 
