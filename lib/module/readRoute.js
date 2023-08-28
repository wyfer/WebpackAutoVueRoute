const { parseRoute } = require('./parseRoute');

const readRoute = (vuePages, autoRouteConf, AUTO_IMPORTS, AUTO_LYOUT_IMPORTS) => {
  // 解析文件
  return vuePages.map(filePath => {
    // 解析组件
    const { route, routeImport, layoutImport } = parseRoute(filePath, autoRouteConf);

    // 导入页面路由
    AUTO_IMPORTS.push(routeImport)

    // 导入布局路由
    if (layoutImport && !AUTO_LYOUT_IMPORTS.some(l => l.name === layoutImport.name)) {
      AUTO_LYOUT_IMPORTS.push(layoutImport)
    }

    // 转化为路由对象
    return route;
  }).filter(r => !r.isLayout);
}

module.exports = {
  readRoute
}