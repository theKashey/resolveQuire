import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { withAliasInFileName, setWebpackConfig } from '../src/index';

const aliasConfig = '_tests/webpack.config.js';

describe('webpack alias + filename', () => {
  setWebpackConfig(aliasConfig);

  it('should overload by alias: ', () => {
    setWebpackConfig(aliasConfig);
    const baz = withAliasInFileName(proxyquire).noCallThru().load('my-absolute-test-lib/foo', {});
    expect(baz()).to.be.equal('foo');
  });
});
