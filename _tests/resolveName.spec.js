import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { withResolve } from '../lib/index.js';


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

  it('withResolve-zero flow', () => {
    const api = withResolve(proxyquire, './source/api.js', {
      './common/api.js': apiWrap,
      './helper.js': helperWrap
    });

    expect(api.callApi()).to.be.equal('api-wrap');
    expect(api.callHelper()).to.be.equal('helper-wrap');
  });

  it('resolve flow', () => {
    const api = withResolve(proxyquire, './source/api.js', {
      'common/api.js': apiWrap,
      'source/helper.js': helperWrap
    }, ['./']);

    expect(api.callApi()).to.be.equal('api-wrap');
    expect(api.callHelper()).to.be.equal('helper-wrap');
  });

  it('relative flow', () => {
    const api = withResolve(proxyquire, './source/api.js', {
      './common/api': apiWrap,
      './helper': helperWrap
    }, ['./']);

    expect(api.callApi()).to.be.equal('api-wrap');
    expect(api.callHelper()).to.be.equal('helper-wrap');
  });

  it('overload fs', () => {
    const readFile = () => "fs-wrap";
    const api = withResolve(proxyquire, './source/api.js', {
      'fs': {
        readFile
      },
    }, ['./']);
    expect(api.callFS()).to.be.equal('fs-wrap');
  });
});