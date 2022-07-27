const { expect } = require('chai');
const pactum = require('../../src/index');

describe('GraphQL', () => {

  it('with single line graphql query', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `{ hello }`
          }
        },
        response: {
          status: 200,
          body: {
            data: {
              hello: 'Hello World'
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withGraphQLQuery(`{ hello }`)
      .expectStatus(200)
      .expectJson({
        data: {
          hello: 'Hello World'
        }
      })
      .toss();
  });

  it('with single line graphql query - not matching', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'POST',
            path: '/api/graphql',
            graphQL: {
              query: `{ hello }`
            }
          },
          response: {
            status: 200,
            body: {
              data: {
                hello: 'Hello World'
              }
            }
          }
        })
        .post('http://localhost:9393/api/graphql')
        .withGraphQLQuery(`{ world }`)
        .expectStatus(200)
        .expectJson({
          data: {
            hello: 'Hello World'
          }
        });
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('with multi line graphql query', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `
              {
                hero {
                  name
                  age
                }
              }
            `
          }
        },
        response: {
          status: 200,
          body: {
            data: {
              hero: {
                name: 'R2-D2'
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
        query: `
          {
            hero {
              name
              age
            }
          }
        `
      })
      .expectStatus(200)
      .expectJson({
        data: {
          hero: {
            name: 'R2-D2'
          }
        }
      })
      .toss();
  });

  it('with nested graphql query', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `
              {
                hero {
                  name
                  # Queries can have comments!
                  friends {
                    name
                  }
                }
              }
            `
          }
        },
        response: {
          status: 200,
          body: {
            "data": {
              "hero": {
                "name": "R2-D2",
                "friends": [
                  {
                    "name": "Luke"
                  },
                  {
                    "name": "Han Solo"
                  },
                  {
                    "name": "Organa"
                  }
                ]
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
        query: `
          {
            hero {
              name
              # Queries can have comments!
              friends {
                name
              }
            }
          }
        `
      })
      .expectStatus(200)
      .expectJson({
        "data": {
          "hero": {
            "name": "R2-D2",
            "friends": [
              {
                "name": "Luke"
              },
              {
                "name": "Han Solo"
              },
              {
                "name": "Organa"
              }
            ]
          }
        }
      })
      .toss();
  });

  it('with arguments graphql query', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `
              {
                human(id: "1000") {
                  name
                  height
                }
              }
            `
          }
        },
        response: {
          status: 200,
          body: {
            "data": {
              "human": {
                "name": "Luke",
                "height": 1.72
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
        query: `{ human(id: "1000") { name, height } }`
      })
      .expectStatus(200)
      .expectJson({
        "data": {
          "human": {
            "name": "Luke",
            "height": 1.72
          }
        }
      })
      .toss();
  });

  it('with enum arguments graphql query', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `
              {
                human(id: "1000") {
                  name
                  height(unit: FOOT)
                }
              }
            `
          }
        },
        response: {
          status: 200,
          body: {
            "data": {
              "human": {
                "name": "Luke",
                "height": 5.6430448
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
        query: `{
          human(id: "1000") {
            name
            height(unit: FOOT)
          }
        }`
      })
      .expectStatus(200)
      .expectJson({
        "data": {
          "human": {
            "name": "Luke",
            "height": 5.6430448
          }
        }
      })
      .toss();
  });

  it('with alias graphql query', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `
              {
                empireHero: hero(episode: EMPIRE) {
                  name
                }
                jediHero: hero(episode: JEDI) {
                  name
                }
              }
            `
          }
        },
        response: {
          status: 200,
          body: {
            "data": {
              "empireHero": {
                "name": "Luke"
              },
              "jediHero": {
                "name": "R2-D2"
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
        query: `
          {
            empireHero: hero(episode: EMPIRE) {
              name
            }
            jediHero: hero(episode: JEDI) {
              name
            }
          }
        `
      })
      .expectStatus(200)
      .expectJson({
        "data": {
          "empireHero": {
            "name": "Luke"
          },
          "jediHero": {
            "name": "R2-D2"
          }
        }
      })
      .toss();
  });

  it('with fragments graphql query', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `
              {
                leftComparison: hero(episode: EMPIRE) {
                  ...comparisonFields
                }
                rightComparison: hero(episode: JEDI) {
                  ...comparisonFields
                }
              }

              fragment comparisonFields on Character {
                name
                appearsIn
                friends {
                  name
                }
              }
            `
          }
        },
        response: {
          status: 200,
          body: {
            "data": {
              "leftComparison": {
                "name": "Luke",
                "appearsIn": [
                  "EMPIRE",
                  "JEDI"
                ],
                "friends": [
                  {
                    "name": "Han Solo"
                  },
                  {
                    "name": "Organa"
                  },
                  {
                    "name": "C-3PO"
                  },
                  {
                    "name": "R2-D2"
                  }
                ]
              },
              "rightComparison": {
                "name": "R2-D2",
                "appearsIn": [
                  "EMPIRE",
                  "JEDI"
                ],
                "friends": [
                  {
                    "name": "Luke"
                  },
                  {
                    "name": "Han Solo"
                  },
                  {
                    "name": "Organa"
                  }
                ]
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
        query: `
          {
            leftComparison: hero(episode: EMPIRE) {
              ...comparisonFields
            }
            rightComparison: hero(episode: JEDI) {
              ...comparisonFields
            }
          }

          fragment comparisonFields on Character {
            name
            appearsIn
            friends {
              name
            }
          }
        `
      })
      .expectStatus(200)
      .expectJson({
        "data": {
          "leftComparison": {
            "name": "Luke",
            "appearsIn": [
              "EMPIRE",
              "JEDI"
            ],
            "friends": [
              {
                "name": "Han Solo"
              },
              {
                "name": "Organa"
              },
              {
                "name": "C-3PO"
              },
              {
                "name": "R2-D2"
              }
            ]
          },
          "rightComparison": {
            "name": "R2-D2",
            "appearsIn": [
              "EMPIRE",
              "JEDI"
            ],
            "friends": [
              {
                "name": "Luke"
              },
              {
                "name": "Han Solo"
              },
              {
                "name": "Organa"
              }
            ]
          }
        }
      })
      .toss();
  });

  it('with operation name graphql query', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `
              query HeroNameAndFriends {
                hero {
                  name
                  friends {
                    name
                  }
                }
              }
            `
          }
        },
        response: {
          status: 200,
          body: {
            "data": {
              "hero": {
                "name": "R2-D2",
                "friends": [
                  {
                    "name": "Luke"
                  },
                  {
                    "name": "Han Solo"
                  },
                  {
                    "name": "Organa"
                  }
                ]
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
        query: `
          query HeroNameAndFriends {
            hero {
              name
              friends {
                name
              }
            }
          }
        `
      })
      .expectStatus(200)
      .expectJson({
        "data": {
          "hero": {
            "name": "R2-D2",
            "friends": [
              {
                "name": "Luke"
              },
              {
                "name": "Han Solo"
              },
              {
                "name": "Organa"
              }
            ]
          }
        }
      })
      .toss();
  });

  it('with variables', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `
              query HeroNameAndFriends($episode: Episode) {
                hero(episode: $episode) {
                  name
                  friends {
                    name
                  }
                }
              }
            `,
            variables: {
              "episode": "JEDI"
            }
          }
        },
        response: {
          status: 200,
          body: {
            data: {
              hero: {
                name: 'R2-D2'
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withGraphQLQuery(`
        query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends {
              name
            }
          }
        }`
      )
      .withGraphQLVariables({
        "episode": "JEDI"
      })
      .expectStatus(200)
      .expectJson({
        data: {
          hero: {
            name: 'R2-D2'
          }
        }
      })
      .toss();
  });

  it('GET method with query should work', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/graphql',
          graphQL: {
            query: `{ hello }`
          }
        },
        response: {
          status: 200,
          body: {
            data: {
              hello: 'Hello World'
            }
          }
        }
      })
      .get('http://localhost:9393/api/graphql')
      .withGraphQLQuery(`{ hello }`)
      .expectStatus(200)
      .expectJson({
        data: {
          hello: 'Hello World'
        }
      });
  });

  it('GET method with query & variables should work', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/graphql',
          graphQL: {
            query: `{ hello }`,
            variables: {
              "episode": "JEDI"
            }
          }
        },
        response: {
          status: 200,
          body: {
            data: {
              hello: 'Hello World'
            }
          }
        }
      })
      .get('http://localhost:9393/api/graphql')
      .withGraphQLQuery(`{ hello }`)
      .withGraphQLVariables({
        "episode": "JEDI"
      })
      .expectStatus(200)
      .expectJson({
        data: {
          hello: 'Hello World'
        }
      });
  });

});