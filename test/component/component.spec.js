const pactum = require('../../src/index');

// disable these specs when running locally
xdescribe('JSON Placeholder', () => {

  it('GET', async () => {
    await pactum.spec()
      .get('https://jsonplaceholder.typicode.com/posts/1')
      .expectStatus(200)
      .expectHeader('content-type', 'application/json; charset=utf-8')
      .expectHeader('connection', /\w+/)
      .expectJsonLike({
        userId: 1,
        id: 1
      })
      .expectJsonSchema({
        "properties": {
          "userId": {
            "type": "number"
          }
        },
        "required": ["userId", "id"]
      })
      .toss();
  });

  it('GET - with query', async () => {
    await pactum.spec()
      .get('https://jsonplaceholder.typicode.com/comments')
      .withQueryParams('postId', 1)
      .expectStatus(200)
      .expectHeaderContains('content-type', 'application/json')
      .expectJsonLike([
        {
          postId: 1,
          id: 1,
          name: /\w+/g
        }
      ])
      .toss();
  });

  it('GET - invalid post', async () => {
    await pactum.spec()
      .get('https://jsonplaceholder.typicode.com/posts/-1')
      .expectStatus(404)
      .expectJson({})
      .toss();
  });

  it('POST', async () => {
    await pactum.spec()
      .post('https://jsonplaceholder.typicode.com/posts')
      .withJson({
        title: 'foo',
        body: 'bar',
        userId: 1
      })
      .expectStatus(201)
      .toss();
  });

  it('POST - with headers', async () => {
    await pactum.spec()
      .post('https://jsonplaceholder.typicode.com/posts')
      .withJson({
        title: 'foo',
        body: 'bar',
        userId: 1
      })
      .withHeaders({
        "Content-Type": "application/json; charset=UTF-8"
      })
      .expectStatus(201)
      .toss();
  });

  it('POST - with body', async () => {
    await pactum.spec()
      .post('https://jsonplaceholder.typicode.com/posts')
      .withHeaders({
        "content-type": "application/json"
      })
      .withBody({
        title: 'foo',
        body: 'bar',
        userId: 1
      })
      .expectStatus(201)
      .toss();
  });

  it('PUT', async () => {
    await pactum.spec()
      .put('https://jsonplaceholder.typicode.com/posts/1')
      .withJson({
        id: 1,
        title: 'foo',
        body: 'bar',
        userId: 1
      })
      .expectStatus(200)
      .toss();
  });

  it('PATCH', async () => {
    await pactum.spec()
      .patch('https://jsonplaceholder.typicode.com/posts/1')
      .withJson({
        title: 'foo'
      })
      .expectStatus(200)
      .toss();
  });

  it('DELETE', async () => {
    await pactum.spec()
      .delete('https://jsonplaceholder.typicode.com/posts/1')
      .expectStatus(200)
      .toss();
  });

});

// disable these specs when running locally
xdescribe('HTTP Bin - Status', () => {

  it('should be ok', async () => {
    await pactum.spec()
      .get('http://httpbin.org/status/200')
      .expectStatus(200)
      .toss();
  });

  it('should be created', async () => {
    await pactum.spec()
      .get('http://httpbin.org/status/201')
      .expectStatus(201)
      .toss();
  });

  it('should be no content', async () => {
    await pactum.spec()
      .get('http://httpbin.org/status/204')
      .expectStatus(204)
      .toss();
  });

  it('should be not modified', async () => {
    await pactum.spec()
      .get('http://httpbin.org/status/304')
      .expectStatus(304)
      .toss();
  });

  it('should be a bad request', async () => {
    await pactum.spec()
      .get('http://httpbin.org/status/400')
      .expectStatus(400)
      .toss();
  });

  it('should be unauthorized', async () => {
    await pactum.spec()
      .get('http://httpbin.org/status/401')
      .expectStatus(401)
      .toss();
  });

  it('should be forbidden', async () => {
    await pactum.spec()
      .get('http://httpbin.org/status/403')
      .expectStatus(403)
      .toss();
  });

  it('should be not found', async () => {
    await pactum.spec()
      .get('http://httpbin.org/status/404')
      .expectStatus(404)
      .toss();
  });

  it('should be conflict', async () => {
    await pactum.spec()
      .get('http://httpbin.org/status/409')
      .expectStatus(409)
      .toss();
  });

  it('should be a teapot', async () => {
    await pactum.spec()
      .get('http://httpbin.org/status/418')
      .expectStatus(418)
      .toss();
  });

  it('should be internal system error', async () => {
    await pactum.spec()
      .get('http://httpbin.org/status/500')
      .expectStatus(500)
      .toss();
  });

});

// disable these specs when running locally
xdescribe('HTTP Bin - Responses', () => {

  it('should be deny', async () => {
    await pactum.spec()
      .get('http://httpbin.org/deny')
      .expectStatus(200)
      .expectBodyContains(`YOU SHOULDN'T BE HERE`)
      .toss();
  });

  it('should be deny', async () => {
    await pactum.spec()
      .get('http://httpbin.org/robots.txt')
      .expectStatus(200)
      .expectBody(`User-agent: *\nDisallow: /deny\n`)
      .toss();
  });

});