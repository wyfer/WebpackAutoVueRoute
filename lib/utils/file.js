const fg = require("fast-glob");
const fs = require("fs");
const path = require("path");

const readFolder = (path) => {
  return fg.sync("**/*.vue", {
    onlyFiles: true,
    cwd: path,
  });
}

const writeFile = (outPath, str) => {
  const outFolder = path.join(outPath);
  fs.writeFileSync(outFolder, str, "utf8");
}

module.exports = {
  readFolder,
  writeFile
}