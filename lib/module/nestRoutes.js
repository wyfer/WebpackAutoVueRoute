const routePush = (routeParent, route) => {
  routeParent.push(route);
}

function convertToNestedRoutes(routes, AUTO_IMPORTS, AUTO_LYOUT_IMPORTS) {
  const nestedRoutes = [];

  routes.forEach(route => {
    const { parsePath } = route.pageParams;
    // 将路径拆分成数组
    const pathParts = parsePath.split('/').filter(segment => segment !== '');

    // 不要最后一项
    pathParts.length > 1 && pathParts.pop();

    let parent = nestedRoutes;
    let nestedRoute = null;

    pathParts.forEach(part => {
      nestedRoute = parent.find(r => r.name === part); // 查找已存在的嵌套路由

      if (!nestedRoute) {
        let layoutHash = AUTO_LYOUT_IMPORTS[0].hash;
        let layoutMeta = {};

        const routeLayout = AUTO_IMPORTS.find(i => i.name === part);

        if (routeLayout) {
          const { hash, meta } = routeLayout
          layoutHash = hash;
          layoutMeta = meta;
        }

        // 是否存在路由布局
        nestedRoute = {
          name: part,
          path: part === 'index' ? '' : part, // 将 'index' 路径设置为空字符串
          component: layoutHash,
          ...layoutMeta,
          pageParams: route.pageParams,
          children: [],
        };
        routePush(parent, nestedRoute);
      }

      parent = nestedRoute.children; // 更新父级路由为当前嵌套路由的 children
    });

    // 将当前路由添加到最后一个嵌套路由的 children
    if (nestedRoute) {
      routePush(nestedRoute.children, route);
    }
  });

  return nestedRoutes;
}

const nestRoutes = (routes, AUTO_IMPORTS, AUTO_LYOUT_IMPORTS) => {
  // 组装路由
  return convertToNestedRoutes(routes, AUTO_IMPORTS, AUTO_LYOUT_IMPORTS);
}

module.exports = {
  nestRoutes
}