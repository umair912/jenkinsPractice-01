const pactum = require('../../src/index');
const { like, regex, eachLike, includes } = require('pactum-matchers');

describe('Request Matchers', () => {

  it('GET - one interaction - like', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          queryParams: {
            date: like('08/04/2020')
          }
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
      })
      .get('http://localhost:9393/api/projects/1')
      .withQueryParams('date', '12/00/9632')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - regex instance', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          queryParams: {
            date: regex('08/04/2020', /\w+/g)
          }
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
      })
      .get('http://localhost:9393/api/projects/1')
      .withQueryParams('date', '12/00/9632')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - regex string', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          queryParams: {
            date: regex('08/04/2020', "\\w+")
          }
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
      })
      .get('http://localhost:9393/api/projects/1')
      .withQueryParams('date', '12/00/9632')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - query regex date', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          queryParams: {
            date: regex('2020-12-12', /^\d{4}-\d{2}-\d{2}$/)
          }
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
      })
      .get('http://localhost:9393/api/projects/1')
      .withQueryParams('date', '2020-06-24')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('POST - one interaction - regex instance', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/projects/1',
          body: {
            id: regex(123, /\d+/),
            name: 'Bark'
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/projects/1')
      .withBody({
        id: 100,
        name: 'Bark'
      })
      .expectStatus(200)
      .toss();
  });

  it('POST - one interaction - regex string', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          body: {
            id: regex(123, "\\d+"),
            name: 'Bark'
          }
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
      })
      .get('http://localhost:9393/api/projects/1')
      .withBody({
        id: 100,
        name: 'Bark'
      })
      .expectStatus(200)
      .toss();
  });

  it('POST - one interaction - each like', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/projects/1',
          body: eachLike({
            id: regex(123, /\d+/),
            name: 'Bark'
          })
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/projects/1')
      .withBody([{
        id: 100,
        name: 'Bark'
      }])
      .expectStatus(200)
      .toss();
  });

  it('GET - one interaction - includes', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          queryParams: {
            date: includes('2020')
          },
          headers: {
            'x-Request-Id': includes('PutItem')
          }
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
      })
      .get('http://localhost:9393/api/projects/1')
      .withQueryParams('date', '12/00/2020')
      .withHeaders({
        'x-request-id': 'DynamoDB.2018.PutItem'
      })
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - headers like', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          headers: {
            date: like('08/04/2020')
          }
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
      })
      .get('http://localhost:9393/api/projects/1')
      .withHeaders({'date': '12/00/9632', 'place': 'hyd'})
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - multiple headers like', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          headers: {
            date: like('08/04/2020'),
            place: 'hyd'
          }
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
      })
      .get('http://localhost:9393/api/projects/1')
      .withHeaders({'date': '12/00/9632', 'place': 'hyd'})
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

});