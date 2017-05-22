import { relative, dirname } from 'path';
import { processFile, readAlises } from './aliases';
import Module from 'module';

let settings = 0;

const configureAliases = (conf) => {
  settings = readAlises(conf)
};


const relativeName = (a,b) => {
  const name = relative(a,b);
  if(name && name[0]!='/' && name[0]!='.'){
    return './'+name;
  }
  return name;
};

const aliasResolve = (fileName, stubs, relativeModule) => {
  // nodejs internals
  const sourceFile = Module._resolveFilename(fileName, relativeModule);
  const sourceDir = dirname(sourceFile);

  let result = {};
  for (var i in stubs) {
    const resolvedFileName = processFile(i, settings);
    if (resolvedFileName) {
      result[relativeName(sourceDir, resolvedFileName)] = stubs[i];
    } else {
      result[i] = stubs[i];
    }
  }
  return result;
};

export {
  configureAliases
};

export default aliasResolve;