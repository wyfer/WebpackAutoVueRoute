const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const vueSfcCompiler = require("@vue/compiler-sfc");
const { algorithm, getChunkName } = require('../utils/tools');

// 根据vue组件拆分字段信息
const parseRoute = (filePath, autoRouteConf) => {
  const { routePageRelative, routePageDir, routeTag, useLayout, layoutDir } = autoRouteConf;

  // 根据路径读取文件
  const vueFile = fs.readFileSync(path.join(routePageRelative, filePath), "utf8");

  // 通过vueSFCCompiler进行解析，兼容vue2各版本
  const vueTmp = (vueSfcCompiler.parseComponent || vueSfcCompiler.parse)(vueFile);

  // 额外配置提取
  const customBlocks = vueTmp.customBlocks || vueTmp.descriptor.customBlocks || [];

  // 解析是否存在路由配置
  const routeBlock = customBlocks.find(block => block.type === routeTag);

  const parseName = /\/?([^/]+)\.vue$/.exec(filePath)[1];
  const parsePath = filePath.match(/^(.*?)(?=\.vue)/)[1];

  // 单项route path字段
  const routePath = (!parseName || parseName === 'index') ? '' : parseName.replace(/_/, ":");

  // 单项route name字段
  const routeConfigFileName = parsePath.replace(/[\/\.]/g, '-').replace(/_/, "");

  // 判断是否具有islayout字段，有则为嵌套路由，进行一个标记，后续分析父子关系构建完整的route项
  let isLayout = false;
  // 是否手动配置布局
  let layout = null;

  // 判断是否存在路由配置项
  let pageMeta = {};

  if (routeBlock) {
    const routeConfig = routeBlock.content ? yaml.load(routeBlock.content) : {};
    // 解析内容
    pageMeta = routeConfig;

    // 去掉布局标记
    if (pageMeta.hasOwnProperty("isLayout")) {
      // 设置标记
      isLayout = !!pageMeta.isLayout;
      // delete pageMeta.isLayout;
    }

    // 配置布局
    if (pageMeta.hasOwnProperty("layout")) {
      // 设置布局
      layout = pageMeta.layout;
      // delete pageMeta.layout;
    }
  }

  // webpack_chunk名称
  const webpackChunkName = getChunkName(filePath);

  // 生成唯一hash
  const pageHash = algorithm();

  // import资源增加
  const routeImport = {
    name: parseName,
    hash: pageHash,
    meta: pageMeta,
    str: `const ${pageHash} = ()=>import(/* webpackChunkName: "chunk_${webpackChunkName}" */ '${routePageDir}/${filePath}')`
  };

  let layoutImport = null;
  // 如果配置路由布局
  if (useLayout && layout) {
    // 生成唯一hash
    const pageHash = algorithm();

    layoutImport = {
      name: layout,
      hash: pageHash,
      config: pageMeta,
      str: `const ${pageHash} = ()=>import(/* webpackChunkName: "chunk_${layout}" */ '${layoutDir}/${layout}.vue')`
    };
  }

  // 单个路由模块
  return {
    route: {
      path: routePath,
      name: routeConfigFileName,
      component: pageHash,
      ...(pageMeta || {}),
      pageParams: {
        pageHash,
        filePath,
        parseName,
        parsePath: parsePath.replace(/_/, ":"),
      }
    },
    routeImport,
    layoutImport
  };
}

module.exports = { parseRoute }