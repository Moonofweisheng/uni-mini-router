#  常见问题FAQ

本节介绍在开发过程当中遇到的部分 **常见问题** 以及 **解决办法**

## nvue支持吗？

目前没有支持。


## Uni Mini Router的目标？

`Uni Mini Router`目标是基于小程序平台，将`uni-app`路由相关的API对齐`Vue Router`，而并非提供完全的`Vue Router`。


## 导航守卫的局限？
- 首屏无法触发前置导航守卫：建议有相关需求的用户，自行创建空白首屏页面进行相关业务逻辑判断确认后，再进行后续的路由跳转。
- 无法拦截Tabbar页面跳转：Tabbar 页面跳转未使用路由API，故无法拦截。
- 非API返回：非API返回跳转未使用路由API，故无法拦截。


## 关于我们

**如果您的问题不在上述列表中或您有更好的建议，请联系我们 [Moonofweisheng](https://github.com/Moonofweisheng/uni-mini-router)**
