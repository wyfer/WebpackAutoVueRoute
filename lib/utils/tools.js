const crypto = require('crypto');
const { performance } = require('perf_hooks');

const calculateExecutionTime = (() => {
  let executed = false;
  let result;

  return (fn, args) => {
    if (executed) return fn(args);

    const startTime = performance.now();

    result = fn(args);

    const endTime = performance.now();
    console.log(`\x1b[32m${'-'.repeat(45)}\x1b[0m`);
    console.log(`\x1b[32m|  自动化路由生成完毕,总耗时：${(endTime - startTime).toFixed(2)} 毫秒\x1b[0m`);
    console.log(`\x1b[32m${'-'.repeat(45)}\x1b[0m`);

    executed = true;
  };
})();


const error = (log) => {
  console.error(log);

  process.exit(1);
}

// 自动生成注释
const notes = `/* eslint-disable */`;

// 根据时间戳生成唯一标记
const algorithm = function (length = 10) {
  // 生成随机字节
  const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
  // 转换为十六进制字符串并截取指定长度
  const uniqueString = randomBytes.toString('hex').slice(0, length);

  return '_' + uniqueString;
}

const getChunkName = (filePath) => {
  return filePath
    .split("/")
    .map(item => `${item[0].toUpperCase()}${item.slice(1)}`)
    .join("")
    .replace(/\.vue/g, "") || 'index';
}


module.exports = {
  calculateExecutionTime,
  error,
  notes,
  algorithm,
  getChunkName,
}