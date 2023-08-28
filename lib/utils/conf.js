const defaultConf = {
  // 需要解析的vue视图文件目录绝对路径
  routePageRelative: "src/views",
  // 路由页面所在文件夹
  routePageDir: "@/views",
  // 输出路由文件路径和名称
  routeOutFile: "src/router/routes.js",
  // 页面路由配置标签
  routeTag: "route",
  // 是否启用布局
  useLayout: false,
  // 布局文件路径
  layoutDir: '@/layouts',
  // 排除目录
  exclude: null,
}

const defaultLayout = [
  {
    name: 'basics',
    hash: 'basicsLayout',
    str: `const basicsLayout = {name: "RouteView",render: h => h("router-view")}`
  }
]

module.exports = {
  defaultConf,
  defaultLayout
}
