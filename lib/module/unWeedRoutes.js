function moveObjectToEnd(arr) {
  const filteredArr = arr.filter(obj => obj.path.includes(':')).map(r => {
    if (r.dynamicParams) {
      r.path += '?';
    }
    return r;
  });

  const remainingArr = arr.filter(obj => !obj.path.includes(':'));

  return remainingArr.concat(filteredArr);
}

/**
 * 将嵌套数组转换为字符串的函数
 * @param {Array} routes - 带有嵌套结构的数组对象
 * @param {number} level - 当前嵌套层级，默认为0
 * @returns {string} - 转换后的字符串
 */
function convertNestedArrayToString(nestRoutes, level = 0) {
  // 生成制表符，根据当前层级进行缩进
  const tab = "\t".repeat(level);
  let result = [];

  // 动态路由参数调序
  let routes = moveObjectToEnd(nestRoutes);

  for (let i = 0; i < routes.length; i++) {
    // 解构赋值，将pageParams与其他属性分离
    let { pageParams, ...obj } = routes[i];

    // 删除符合条件的路由名称
    if (obj.children && obj.children.some(r => r.name === obj.name)) {
      delete obj.name;
    }

    // 如果是最外层的对象，给path属性添加斜杠
    if (level === 0) {
      obj.path = '/' + obj.path;
    }

    // 删除布局相关配置字段
    delete obj.isLayout;
    delete obj.layout;
    delete obj.dynamicParams;

    let objStr = `${tab}{\n`;

    // 遍历对象的属性
    for (const key in obj) {
      const value = obj[key];
      const valueType = typeof value;

      if (key === "children") {
        // 如果是children属性，递归调用函数并添加缩进
        objStr += `${tab}\t"${key}": [\n`;
        objStr += convertNestedArrayToString(obj[key], level + 2);
        objStr += `${tab}\t],\n`;
      } else if (key === 'component') {
        // 如果是component属性，直接添加值
        objStr += `${tab}\t"${key}": ${value},\n`;
      } else if (valueType === "string" || valueType === "number" || valueType === "boolean") {
        // 如果是字符串、数字或布尔值，使用JSON.stringify转换为字符串，并添加引号
        objStr += `${tab}\t"${key}": ${JSON.stringify(value)},\n`;
      } else if (valueType === "object" && Array.isArray(value)) {
        // 如果是对象数组，使用map方法遍历数组并添加缩进
        objStr += `${tab}\t"${key}": [\n`;
        objStr += value.map(item => `${tab}\t\t"${item}",\n`).join("");
        objStr += `${tab}\t],\n`;
      } else if (valueType === "object") {
        // 如果是嵌套对象，直接转换为字符串
        objStr += `${tab}\t"${key}": ${JSON.stringify(value)},\n`;
      }
    }

    objStr += `${tab}}${i === routes.length - 1 ? "" : ","}\n`;
    result.push(objStr);
  }

  return result.join("");
}

const unWeedRoutes = (routes) => {
  return "[" + convertNestedArrayToString(routes) + "]"
}

module.exports = {
  unWeedRoutes
}