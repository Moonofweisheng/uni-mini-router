# 安装
本节介绍如何在`uni-app`项目中安装`Uni Mini Router`和生成路由表的插件`uni-read-pages-vite`或`uni-read-pages`。


::: code-group
```bash [npm]
npm i uni-mini-router --save
```

```bash [yarn]
yarn add uni-mini-router -D
```

```bash [pnpm]
pnpm add uni-mini-router -D
```
:::



## 路由表插件安装

我们提供了两种方式来生成路由表：[uni-parse-pages](https://www.npmjs.com/package/uni-parse-pages)和[uni-read-pages-vite](https://www.npmjs.com/package/uni-read-pages-vite)，这两种方式都可以实现将`pages.json`中的路由信息转化为`uni-mini-router`需要的路由表信息，其中`uni-read-pages-vite`依赖`vite`，在编译时将读取`pages.json`生成的路由表注入全局变量，而`uni-parse-pages`不依赖`vite`，在应用每次热重载时都会从`pages.json`中读取信息生成路由表。

由于`uni-app`在编译到小程序端时无法触发`vite`的热更新，所以目前只有使用`uni-parse-pages`生成路由表才可以实现路由信息热更新的功能。

> 注意！！！`uni-parse-pages`在`uni-mini-router@0.1.0`版本起获得支持，在之前的版本使用会有问题。

### 以下两种方式二选一：

### 使用uni-parse-pages生成路由表（0.1.0起支持）

::: code-group
```bash [npm]
npm i add uni-parse-pages --save
```

```bash [yarn]
yarn add add uni-parse-pages -D
```

```bash [pnpm]
pnpm add add uni-parse-pages -D
```
:::


### 使用uni-read-pages-vite生成路由表

::: code-group
```bash [npm]
npm i add uni-read-pages-vite --save
```

```bash [yarn]
yarn add add uni-read-pages-vite -D
```

```bash [pnpm]
pnpm add add uni-read-pages-vite -D
```
:::


## 配置路由表

:::warning 关于本步骤
在使用`uni-read-pages-vite`生成路由表时需要进行此项配置，而使用`uni-parse-pages`则不需要。
:::


配置 `vite.config.ts` 通过 `define` 注入全局变量 [查看文档](https://cn.vitejs.dev/config/shared-options.html#define)

>注意：在 Vite 中使用 `define` 注入的全局变量并不是热更新的，因为这些变量是在构建时被注入到代码中的，而不是在运行时动态生成的。这意味着如果您更新了`page.json`，则需要重新构建应用程序才能使更改生效。

### CLI创建的项目配置
```ts
//vite.config.ts
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import TransformPages from 'uni-read-pages-vite'

export default defineConfig({
  plugins: [uni()],
  define: {
    ROUTES: new TransformPages().routes, // 注入路由表
  }
});
```

### HbuilderX创建的项目配置
```ts
//vite.config.ts
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import TransformPages from 'uni-read-pages-vite'

export default defineConfig({
  plugins: [uni()],
  define: {
    ROUTES: new TransformPages(__dirname).routes, // 注入路由表
  }
});
```

### 声明文件`type.d.ts`
`.d.ts`文件的作用是描述`JavaScript`库、模块或其他代码的类型声明和元数据，以便编辑器和开发者能够更好地理解和使用该代码。在编译时，`TypeScript`编译器会使用`.d.ts`文件来验证代码正确性，并帮助开发者在开发过程中提供更好的代码提示和自动补全功能。

在项目src目录下（HbuilderX创建的项目可以在根目录下）创建`type.d.ts`文件。

```ts
//type.d.ts
declare const ROUTES: []
```
