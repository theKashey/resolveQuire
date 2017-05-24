import { basename } from 'path';
import resolve from './resolve';
import aliasResolve, { configureAliases } from './aliasResolve';
import isAllStubsUsed from './withAllStubsUsed';

let thisModule = module;

/**
 * will override base search dir
 */
const overrideEntryPoint = (newModule) => {
  thisModule = newModule || module.parent;
  const opener = require.resolve(module.parent.filename);
  delete require.cache[opener];
};

function withCustomLoad(proxyquire, callback) {
  const originalLoad = proxyquire.load;

  const load = proxyquire.load = function (fileName, stubs) {
    return callback(fileName, stubs, originalLoad);
  }.bind(proxyquire);

  load._parentquire = proxyquire;
  for (var i in proxyquire) {
    if (proxyquire.hasOwnProperty(i)) {
      load[i] = proxyquire[i];
    }
  }
  load._resolvequire = true;
  // the goal is to "push" load to primary object
  load._parentquire.load = load;

  return load;
}

/**
 * Will search for stubs in search paths and create new stubs
 * @param {Proxyquire} proxyquire
 * @param {String[]} paths - search paths
 * @return {Proxyquire}
 */
function withRelativeResolve(proxyquire, paths) {
  return withCustomLoad(
    proxyquire,
    (fileName, stubs, _load) =>
      _load.call(proxyquire, fileName, resolve(fileName, stubs, paths, (thisModule || module).parent))
  );
}

/**
 * will convert stubs written in aliases to final `nodejs` variants
 * @param {Proxyquire} proxyquire
 * @return {Proxyquire}
 */
function withAliasResolve(proxyquire) {
  return withCustomLoad(
    proxyquire,
    (fileName, stubs, _load) =>
      _load.call(proxyquire, fileName, aliasResolve(fileName, stubs, (thisModule || module).parent))
  );
}

/**
 * Creates a new proxyquire instance
 * @param {Proxyquire.prototype} Proxyquire
 * @return {Proxyquire}
 */
function withIndirectUsage(Proxyquire) {
  delete require.cache[require.resolve(__filename)];
  return new Proxyquire((thisModule || module).parent);
}

/**
 * @param {String} webpack.alias.conf location
 */
function setWebpackConfig(conf) {
  configureAliases(conf);
}

/**
 * Will test is all provided stubs are in use
 * @param {Proxyquire} proxyquire
 * @return {Proxyquire}
 */
function withAllStubsUsed(proxyquire) {
  return withCustomLoad(
    proxyquire,
    (fileName, stubs, _load) => {
      const { proxy, findUnused } = isAllStubsUsed(stubs);
      const result = _load.call(proxyquire, fileName, proxy);
      const unused = findUnused();
      if (unused) {
        throw new Error('resolvequire: some stubs is listed by unused: ' + unused);
      }
      return result;
    }
  );
}

/**
 * will also use aliases in fileName
 * @param proxyquire
 */
function withAliasInFileName(proxyquire) {
  return withCustomLoad(
    proxyquire,
    (fileName, stubs, _load) => {
      const parent = (thisModule || module).parent;
      const aliases = aliasResolve(parent.filename, {
        [fileName]: true
      }, parent);
      return _load.call(proxyquire, Object.keys(aliases)[0], stubs)
    }
  );
}

/**
 * will also try to resolve fileName
 * @param proxyquire
 */
function withRelativeFileName(proxyquire, paths) {
  return withCustomLoad(
    proxyquire,
    (fileName, stubs, _load) => {
      const parent = (thisModule || module).parent;
      const aliases = resolve(basename(parent.filename), {
        [fileName]: true
      }, paths, parent);
      return _load.call(proxyquire, Object.keys(aliases)[0], stubs)
    }
  );
}

// delete this module from the cache to force re-require in order to allow resolving test module via parent.module
delete require.cache[require.resolve(__filename)];

module.exports = {
  withIndirectUsage,

  withAliasResolve,
  withRelativeResolve,

  withAliasInFileName,
  withRelativeFileName,

  withAllStubsUsed,

  setWebpackConfig,

  overrideEntryPoint
};