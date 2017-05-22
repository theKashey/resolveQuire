import { expect } from 'chai';
import { proxyquire, withIndirect } from './source/indirect.js';

describe('Indirect usage resolve', () => {

  const apiWrap = {
    method: () => "api-wrap"
  };

  const helperWrap = {
    method: () => "helper-wrap"
  };

  it('proxyquire fail flow', () => {
    let passLoad = false;
    try {
      const api = proxyquire.load('./source/api.js', {});
      passLoad = true;
    } catch (e) {
    }
    expect(passLoad).to.equal(false);
  });

  it('proxyquire withIndirect pass flow', () => {
    let passLoad = false;
    try {
      const api = withIndirect.load('./source/api.js', {
        './common/api.js': apiWrap,
        './helper.js': helperWrap
      });
      passLoad = true;
      expect(api.callApi()).to.be.equal('api-wrap');
      expect(api.callHelper()).to.be.equal('helper-wrap');
    } catch (e) {
      console.error(e);
    }
    expect(passLoad).to.equal(true);
  });

  it('resolve fail flow', () => {
    let passLoad = false;
    try {
      const api = withResolve(proxyquire, './source/api.js', {});
      passLoad = true;
    } catch (e) {
    }
    expect(passLoad).to.equal(false);
  });
});