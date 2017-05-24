import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { withRelativeFileName } from '../src/index';


describe('relative as a module name', () => {

  it('should load final file ', () => {
    const baz = withRelativeFileName(proxyquire, './lib/a')
      .noCallThru()
      .load('./foo', {});
    expect(baz()).to.be.equal('foo');
  });
});
