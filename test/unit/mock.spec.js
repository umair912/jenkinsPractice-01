const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();

const Server = require('../../src/models/server');

const mock = require('../../src/exports/mock');
const helper = require('../../src/helpers/helper');
const config = require('../../src/config');

describe('Mock', () => {

  beforeEach(() => {
    this.serverStartStub = sandbox.stub(Server.prototype, 'start');
    this.serverStopStub = sandbox.stub(Server.prototype, 'stop');
    this.serverAddInteractionStub = sandbox.stub(Server.prototype, 'addInteraction');
    this.serverRemoveInteractionStub = sandbox.stub(Server.prototype, 'removeInteraction');
    this.helperGetRandomIdStub = sandbox.stub(helper, 'getRandomId');
  });

  it('start', async () => {
    await mock.start();
    expect(this.serverStartStub.callCount).equals(1, 'should start the server');
  });

  it('start with port', async () => {
    await mock.start(3000);
    expect(this.serverStartStub.callCount).equals(1, 'should start the server');
  });

  it('start with invalid port', async () => {
    expect(() => mock.start({})).throws('Invalid port number provided');
  });

  it('start with port & host - 127.0.0.1', async () => {
    await mock.start(3000, '127.0.0.1');
    expect(this.serverStartStub.callCount).equals(1, 'should start the server');
  });

  it('start with port & host - 0.0.0.0', async () => {
    await mock.start(3000, '0.0.0.0');
    expect(this.serverStartStub.callCount).equals(1, 'should start the server');
  });

  it('start with port & host - localhost', async () => {
    await mock.start(3000, 'localhost');
    expect(this.serverStartStub.callCount).equals(1, 'should start the server');
  });

  it('start with port & host - localhost', async () => {
    await mock.start(3000, 'localhost');
    expect(this.serverStartStub.callCount).equals(1, 'should start the server');
  });

  it('start with port & invalid host', async () => {
    expect(() => mock.start(3000, 100)).throws('Invalid host provided - 100');
  });

  it('start with invalid port & valid host', async () => {
    expect(() => mock.start('3000', 'localhost')).throws('Invalid port number provided - 3000');
  });

  it('stop', async () => {
    await mock.stop();
    expect(this.serverStopStub.callCount).equals(1, 'should stop the server');
  });

  it('addInteraction - valid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const id = mock.addInteraction(rawInteraction);
    expect(id).to.equals('random');
    expect(this.serverAddInteractionStub.callCount).equals(1, 'should add a default mock interaction');
  });

  it('addInteraction - invalid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {};
    expect(() => { mock.addInteraction(rawInteraction); }).throws('`request` is required');
  });

  it('removeInteraction', () => {
    mock.removeInteraction('id');
    expect(this.serverRemoveInteractionStub.callCount).equals(1, 'should remove default mock interaction');
    expect(this.serverRemoveInteractionStub.args[0]).deep.equals(['id']);
  });

  it('addInteraction - array - valid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteractions = [{
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    }];
    const id = mock.addInteraction(rawInteractions);
    expect(id).to.deep.equals(['random']);
    expect(this.serverAddInteractionStub.callCount).equals(1, 'should add a default mock interaction');
  });

  it('addInteraction - array of multiple items - valid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteractions = [
      {
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      },
      {
        request: {
          method: 'GET',
          path: '/api/projects/2'
        },
        response: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'bake'
          }
        }
      }
    ];
    const id = mock.addInteraction(rawInteractions);
    expect(id).to.deep.equals(['random', 'random']);
    expect(this.serverAddInteractionStub.callCount).equals(2, 'should add two default mock interactions');
  });

  it('getInteraction - undefined', () => {
    expect(mock.getInteraction()).to.be.null;
  });

  it('getInteraction - invalid id', () => {
    expect(mock.getInteraction('abc')).to.be.null;
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    config.mock.port = 9393;
  });

});