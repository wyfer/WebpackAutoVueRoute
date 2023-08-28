const { error } = require('../utils/tools');

const extendLayout = (routes, layouts) => {
  if (!layouts.find(ly => ly.name === "default")) {
    error('没有找到默认布局，请检查！')
  }

  // 使用数组的map方法遍历routes数组，并返回新的数组
  return routes.map(moduleRoute => {
    // 使用解构赋值从moduleRoute对象中提取path和layout属性，如果layout属性不存在，则默认值为'default'
    const { path, isLayout, layout = 'default' } = moduleRoute;

    const layoutHash = layouts.find(ly => ly.name === layout).hash;

    if (isLayout) {
      // 创建一个包含path、component和children属性的layoutObj对象
      const layoutObj = {
        path,
        component: layoutHash,
        children: []
      };

      // 将moduleRoute对象的path属性设为空字符串
      moduleRoute.path = '';
      layoutObj.children = [moduleRoute]

      // 返回layoutObj对象
      return layoutObj;
    } else {
      moduleRoute.component = layoutHash;

      return moduleRoute;
    }
  });
};

module.exports = {
  extendLayout
}