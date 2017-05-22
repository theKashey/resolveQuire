import resolve from './resolve';
import aliasResolve, { configureAliases } from './aliasResolve';

let thisModule = module;

/**
 *
 * @param newModule
 */
const overrideEntryPoint = (newModule) => {
  thisModule = newModule || module.parent;
  const opener = require.resolve(module.parent.filename);
  delete require.cache[opener];
};

function withCustomLoad(proxyquire, callback) {
  const originalLoad = proxyquire.load;

  proxyquire.load = function (fileName, stubs) {
    return callback(fileName, stubs, originalLoad);
  }.bind(proxyquire);

  return proxyquire.load;
}

function withRelativeResolve(proxyquire, paths) {
  return withCustomLoad(
    proxyquire,
    (fileName, stubs, _load) =>
      _load.call(proxyquire, fileName, resolve(fileName, stubs, paths, (thisModule || module).parent))
  );
}

function withAliasResolve(proxyquire) {
  return withCustomLoad(
    proxyquire,
    (fileName, stubs, _load) =>
      _load.call(proxyquire, fileName, aliasResolve(fileName, stubs, (thisModule || module).parent))
  );
}

function withIndirectUsage(Proxyquire) {
  delete require.cache[require.resolve(__filename)];
  return new Proxyquire((thisModule || module).parent);
}

function setWebpackConfig(conf) {
  configureAliases(conf);
}

// delete this module from the cache to force re-require in order to allow resolving test module via parent.module
delete require.cache[require.resolve(__filename)];

module.exports = {
  withIndirectUsage,

  withAliasResolve,
  withRelativeResolve,

  setWebpackConfig,

  overrideEntryPoint
};