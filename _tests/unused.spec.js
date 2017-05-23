import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { withAllStubsUsed } from '../src/index.js';

describe('withAllStubsUsed', () => {

  const _proxy = withAllStubsUsed(proxyquire);

  it('will not fail then no stubs provided', () => {
    _proxy.load('./source/api.js', {});
  });

  it('will not fail then stub is used', () => {
    _proxy.load('./source/api.js', {
      fs: { someStub: 1 }
    });
  });

  it('will fail then stub is unused', () => {
    try {
      _proxy.load('./source/api.js', {
        unusedStub: {}
      })
      expect('should not be called').to.equal(true);
    } catch (e){
    }
  });
});