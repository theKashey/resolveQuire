import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { withAliasResolve, setWebpackConfig } from '../src/index';

const aliasConfig = '_tests/webpack.config.js';

describe('webpack alias + proxyquire ', () => {
  it('check default behavior: ', () => {
    setWebpackConfig(aliasConfig);
    const baz = proxyquire('./lib/a/test.js', {});
    expect(baz()).to.be.equal('foobarbaz');
  });

  it('should overload by alias: ', () => {
    setWebpackConfig(aliasConfig);
    const baz = withAliasResolve(proxyquire)('./lib/a/test.js', {
      'my-absolute-test-lib/foo': function () {
        return 'aa'
      },
      'same-folder-lib/bar': function () {
        return 'bb'
      },
      '../b/baz': function () {
        return 'cc'
      }
    });
    expect(baz()).to.be.equal('aabbcc');
  });

  it('should keep behavior: ', () => {
    setWebpackConfig(aliasConfig);
    const baz = withAliasResolve(proxyquire).noCallThru().load('./lib/a/test.js', {
      'my-absolute-test-lib/foo': function () {
        return 'aa'
      },
      'same-folder-lib/bar': function () {
        return 'bb'
      },
      '../b/baz': function () {
        return 'cc'
      }
    });
    expect(baz()).to.be.equal('aabbcc');
  });
});
