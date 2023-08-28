## 开始

webpack 版本 vue 自动路由生成插件，仿照 Nuxt 配置进行使用，但默认使用层级生成，天然对后台管理项目友好，配合权限使用兼职一飞冲天。

仅兼容 Vue2 版本，Vue3 版本请参考 Vite

## 准备

基于 Node+Webpack 环境搭建，借助@vue/compiler-sfc 完成 vue 组件内容解析，需要特别注意，如果 Vue2.7+项目则需要单独安装该插件

## 使用

1. 选择目录文件夹作为生成入口，默认为 src/views
2. 根据 vue 文件名称来确定组件 Name 属性，默认使用 index.vue 作为当前组件入口
3. 支持动态路由配置
4. 支持布局+路由配置

引入方式：

> vue.config.js

```javascript
const webpackAutoVueRoute = require("webpackAutoVueRoute");

module.exports = {
  configureWebpack: {
    plugins: [
      new AutoVueRoutePlugin({
        // 是否启用布局
        useLayout: false,
        // 排除目录
        exclude: /components|component|modules|layout/i,
      }),
    ],
  },
};
```

## 动态路由

```javascript
src/views/exmaple/index.vue
src/views/exmaple/test.vue
src/views/exmaple/_id.vue
```

上述vue文件会转为：

```javascript
{
    "name": "exmaple",
    "path": "",
    "children": [
        {
            "path": "",
            "name": "exmaple-index",
            "component": // src/views/exmaple/index.vue
        },
        {
            "path": "test",
            "name": "exmaple-test",
            "component": // src/views/exmaple/test.vue
        },
        {
            "path": ":id",
            "name": "exmaple-id",
            "component": // src/views/exmaple/_id.vue
        }
    ],
}
```


### 嵌套路由和参数配置

在组件内新增yaml配置插槽，将会把配置参数进行解析追加到route配置中

其中 isLyout 和 layout 为保留字段，配合完成嵌套路由和layout布局使用。

> src/views/home/home.vue
参考nuxt路由配置规则

```javascript
<route lang="yaml">
isLayout: true
layout: "base"
meta: { aaa: 111, bbb: 222, ccc: 4444, title: "默认标题" }
</route>

将会转化为：

{
    "name": "home",
    "path": "",
    "meta": { "aaa": 111, "bbb": 222, "ccc": 4444, "title": "默认标题" },
    "children": [
        {
            "path": "",
            "name": "home-index",
        }
    ],
}
```

### 默认配置

```javascript
  // 需要解析的vue视图文件目录绝对路径
  routePageRelative: "src/views",
  // 路由页面所在文件夹
  routePageDir: "@/views",
  // 输出路由文件路径和名称
  routeOutFile: "src/router/routes.js",
  // 页面路由配置标签 - 配置yaml进行使用
  routeTag: "route",
  // 是否启用布局
  useLayout: false,
  // 布局文件路径
  layoutDir: '@/layouts',
  // 排除目录 - 支持正则匹配，会过滤调包含字段内容的路由
  exclude: null,
```
