const path = require('path');
const fs = require('fs');

const cachedTest = (function () {
  const cachedTests = {};
  return (path)=> {
    if (!(path in cachedTests)) {
      cachedTests[path] = fs.existsSync(path);
    }
    return cachedTests[path];
  };
})();

const lookup = (paths, key) => {
  let result = key;
  const hasExtension = path.extname(key);
  paths.forEach(tryPath => {
    var targetFile = path.resolve(tryPath, key);
    if (cachedTest(targetFile)) {
      result = targetFile;
    } else {
      if (!hasExtension) {
        if (cachedTest(targetFile + '.js') || cachedTest(targetFile + '.json')) {
          result = targetFile;
        }
      }
    }
  });
  return result;
};

const isRelativeQuire = path => (path[0] == '.' || path.indexOf('/') > 0);
const isRelativeRequire = path => (path[0] == '.');

function resolve(fileToBeRequired, stubs, paths, module) {
  const parentDir = path.dirname(require.resolve(module ? module.filename : './'));
  const fileToBeRequiredLocation = path.join(
    parentDir,
    fileToBeRequired
  );
  const basePath = path.dirname(fileToBeRequiredLocation);
  const searchPaths = [basePath].concat(paths || []).map(tryPath => path.resolve(parentDir, tryPath));

  const keys = Object.keys(stubs);
  const result = {};

  keys.forEach(key => {
    let location = key;
    if (isRelativeQuire(key)) {
      let targetFile = lookup(searchPaths, key);
      if (targetFile !== key) {
        location = path.relative(basePath, targetFile);
        if (path.isAbsolute(targetFile) && !isRelativeRequire(location)) {
          location = '.' + path.sep + location;
          if (!path.extname(location)) {
            result[location + '.js'] = stubs[key];
          }
        }
      }
    }
    result[location] = stubs[key];
  });
  return result;
}

export default resolve;