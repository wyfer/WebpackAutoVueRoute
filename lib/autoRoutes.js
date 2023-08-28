const diff = require('./utils/deep-diff').diff;
const { readRoute } = require('./module/readRoute');
const { nestRoutes } = require('./module/nestRoutes');
const { extendLayout } = require('./module/extendLayout');
const { unWeedRoutes } = require('./module/unWeedRoutes')
const { defaultConf, defaultLayout } = require('./utils/conf');
const { notes, error } = require('./utils/tools');
const { readFolder, writeFile } = require('./utils/file');

// 当前路由
let currentRoutes = [];

/**
 * @description: 生成路由主程序
 * @return {*}
 * @Date: 2022-10-12 13:36:41
 */
const autoRoutes = (options) => {
  // 导入配置
  const autoRouteConf = Object.assign(defaultConf, options);

  // 布局导入明细
  const AUTO_LYOUT_IMPORTS = defaultLayout;

  // 路由导入明细
  const AUTO_IMPORTS = [];

  // 解析路由所在文件夹
  const { routePageRelative, routeOutFile, useLayout, exclude } = autoRouteConf;

  // 读取需要自动生成路由的文件路径下所有vue文件
  const vuePagesFull = readFolder(routePageRelative);

  // 如果目录未找到资源
  if (vuePagesFull.length === 0) {
    error('\n路由目录有误,请检查！\n');
  }

  // 过滤不符合命名路由
  const vuePagesFilter = vuePagesFull.filter(file => !(exclude && exclude.test(file)));

  // 根据目录下的文件列表，筛选具有路由配置的vue文件，并在解析各vue文件过程中初始化路由项数组
  const parseRoutes = readRoute(vuePagesFilter, autoRouteConf, AUTO_IMPORTS, AUTO_LYOUT_IMPORTS);

  // 对比路由
  if (process.env.NODE_ENV === 'development' && currentRoutes.length > 0) {
    const hasChange = diff(currentRoutes, parseRoutes);
    if (!hasChange) {

      return;
    }
  }

  // 生成嵌套结构
  const vuePages = nestRoutes(parseRoutes, AUTO_IMPORTS, AUTO_LYOUT_IMPORTS);

  // 使用布局文件
  let routeExtendLayouts = [];
  if (useLayout) {
    routeExtendLayouts = extendLayout(vuePages, AUTO_LYOUT_IMPORTS)
  }

  // 过滤、删除无用内容,并转化为字符串
  const str = unWeedRoutes(useLayout ? routeExtendLayouts : vuePages);

  // 输出到指定文件
  const outFileStr = `${notes}
  \n
  ${AUTO_LYOUT_IMPORTS.map(item => item.str).join(';\n')}
  \n
  ${AUTO_IMPORTS.map(item => item.str).join(';\n')}
  \n
  export default ${str}
  `;

  // 写入文件
  writeFile(routeOutFile, outFileStr)
};

module.exports = autoRoutes;