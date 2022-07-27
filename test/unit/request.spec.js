const expect = require('chai').expect;

const request = require('../../src/exports/request');
const config = require('../../src/config');

describe('request', () => {

  it('setBaseUrl - null', () => {
    expect(() => request.setBaseUrl(null)).throws('Invalid base url provided - null');
  });

  it('setBaseUrl - undefined', () => {
    expect(() => request.setBaseUrl()).throws('Invalid base url provided - undefined');
  });

  it('setDefaultHeader - null', () => {
    expect(() => request.setDefaultHeaders(null)).throws('Invalid header key provided - null');
  });

  it('setDefaultHeader - undefined', () => {
    expect(() => request.setDefaultHeaders()).throws('Invalid header key provided - undefined');
  });

  it('removeDefaultHeader - undefined', () => {
    expect(() => request.removeDefaultHeader()).throws('Invalid header key provided - undefined');
  });

  it('removeDefaultHeader - which is not present', () => {
    request.removeDefaultHeader('present');
  });

  it('setDefaultHeader & setDefaultHeaders & remove', () => {
    request.setDefaultHeaders('hello', 'world');
    request.setDefaultHeaders('no', 'space');
    request.setDefaultHeaders({
      'gta': 'v',
      'hello': 'space'
    });
    expect(config.request.headers).deep.equals({
      'hello': 'space',
      'no': 'space',
      'gta': 'v'
    });
    request.removeDefaultHeader('no');
    expect(config.request.headers).deep.equals({
      'hello': 'space',
      'gta': 'v'
    });
    request.removeDefaultHeaders();
    expect(config.request.headers).deep.equals({});
  });

  it('setDefaultTimeout - null', () => {
    expect(() => request.setDefaultTimeout(null)).throws('Invalid timeout provided - null');
  });

  it('setDefaultTimeout - undefined', () => {
    expect(() => request.setDefaultTimeout()).throws('Invalid timeout provided - undefined');
  });

  it('setDefaultTimeout - string', () => {
    expect(() => request.setDefaultTimeout('100')).throws('Invalid timeout provided - 100');
  });

  afterEach(() => {
   config.request.headers = {};
  });

});