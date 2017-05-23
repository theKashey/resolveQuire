import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { withRelativeResolve } from '../src/index.js';

describe('Name resolve', () => {

  const apiWrap = {
    method: () => "api-wrap"
  };

  const helperWrap = {
    method: () => "helper-wrap"
  };

  it('standard flow', () => {
    const api = proxyquire.load('./source/api.js', {});

    expect(api.callApi()).to.be.equal('api');
    expect(api.callHelper()).to.be.equal('helper');
  });

  it('proxyquire flow', () => {
    const api = proxyquire.load('./source/api.js', {
      './common/api.js': apiWrap,
      './helper.js': helperWrap
    });

    expect(api.callApi()).to.be.equal('api-wrap');
    expect(api.callHelper()).to.be.equal('helper-wrap');
  });

  it('withRelativeResolve-zero flow', () => {
    const api = withRelativeResolve(proxyquire).load('./source/api.js', {
      './common/api.js': apiWrap,
      './helper.js': helperWrap
    });

    expect(api.callApi()).to.be.equal('api-wrap');
    expect(api.callHelper()).to.be.equal('helper-wrap');
  });

  it('resolve flow', () => {
    const api = withRelativeResolve(proxyquire,['./']).load('./source/api.js', {
      'common/api.js': apiWrap,
      'source/helper.js': helperWrap
    });

    expect(api.callApi()).to.be.equal('api-wrap');
    expect(api.callHelper()).to.be.equal('helper-wrap');
  });

  it('overload fs', () => {
    const readFile = () => "fs-wrap";
    const api = withRelativeResolve(proxyquire, ['./']).load('./source/api.js', {
      'fs': {
        readFile
      },
    });
    expect(api.callFS()).to.be.equal('fs-wrap');
  });
});