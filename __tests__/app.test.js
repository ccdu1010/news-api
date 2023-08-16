const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const endpointsFile = require("../endpoints.json");
const { topicData, userData, articleData, commentData  } = require("../db/data/test-data");

beforeEach(() => {
    return seed({ topicData, userData, articleData, commentData });
});
  
afterAll(() => {
    return db.end();
});

describe("app", () => {
 describe("GET /api/topics", () => {
  test("200:responds with a status of 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("200: responds with an array of topics with correct length", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then((response) => {
      const {topics} = response.body;
      const expectedLength = topicData.length;
      expect(topics).toHaveLength(expectedLength);
    });  
  });
  test("200: responds with an array of topic objects that each have the properties slug, description", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then((response) => {
      const {topics} = response.body;
      topics.forEach((topic) => {
        expect(topic).toHaveProperty("slug", expect.any(String));
        expect(topic).toHaveProperty("description", expect.any(String));
      });
    });  
  });
  test("200: responds with an array of topic objects with correct data", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then((response) => {
      const {topics} = response.body;
      expect(topics).toEqual(topicData);
    });  
  });
 });
 describe("GET /api", () => {
  test("200: responds with an accurate JSON object", () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then((response) => {
      const {endpoints} = response.body;
      expect(endpoints).toEqual(endpointsFile);
    });
  });
 });
 describe("GET /api/articles/:article_id", () => {
  test("200: responds with a status of 200 when the article is found", () => {
    const testArticleId = 4;
    return request(app)
    .get(`/api/articles/${testArticleId}`)
    .expect(200);
  });
  test("404: responds with a status of 404 when the article is not found", () => {
    const testArticleId = 40000;
    return request(app)
    .get(`/api/articles/${testArticleId}`)
    .expect(404);
  });
  test("400: responds with a status of 400 when the article id is an invalid number", () => {
    const testArticleId = "Hello";
    return request(app)
    .get(`/api/articles/${testArticleId}`)
    .expect(400);
  });
  test("200: respond with an article object with the following properties when the article is found", () => {
    const testArticleId = 3;
    return request(app)
    .get(`/api/articles/${testArticleId}`)
    .expect(200)
    .then((response) => {
      const article = response.body.article;
      expect(article).toBeInstanceOf(Object);
      expect(article).toHaveProperty("author", expect.any(String));
      expect(article).toHaveProperty("title", expect.any(String));
      expect(article).toHaveProperty("article_id", testArticleId);
      expect(article).toHaveProperty("body", expect.any(String));
      expect(article).toHaveProperty("topic", expect.any(String));
      expect(article).toHaveProperty("created_at", expect.any(String));
      expect(article).toHaveProperty("votes", expect.any(Number));
      expect(article).toHaveProperty("article_img_url", expect.any(String));
    })
  })
 });
 describe("GET /api/articles", () => {
  test("200: responds with a status of 200 when article objects are found", () => {
    return request(app).get(`/api/articles`).expect(200);
  });
  test("200: responds with correct comment_count on related actricle_id", () => {
    return request(app)
    .get(`/api/articles`)
    .expect(200)
    .then((response) => { 
      const articleIdToTest = 3;
      const articles = response.body.articles.filter(article => article.article_id === articleIdToTest);
      const expectedCommentCount = 2;
      expect(articles[0]).toHaveProperty("comment_count", expectedCommentCount);
    });
  });
  test("200: responds with articles sorted descending based on created_at", () => {
    return request(app)
    .get(`/api/articles`)
    .expect(200)
    .then((response) => {
      const { articles } = response.body;
      expect(articles).toBeSortedBy('created_at', { descending: true });
    })
  });
  test("200: respond with an article object with the following properties when article objects are found", () => {
    return request(app)
    .get(`/api/articles`)
    .expect(200)
    .then((response) => {
      const {articles} = response.body;
      expect(articles.length).not.toEqual(0);
      articles.forEach((article) => {
      expect(article).toBeInstanceOf(Object);
      expect(article).toHaveProperty("author", expect.any(String));
      expect(article).toHaveProperty("title", expect.any(String));
      expect(article).toHaveProperty("article_id", expect.any(Number));
      expect(article).toHaveProperty("topic", expect.any(String));
      expect(article).toHaveProperty("created_at", expect.any(String));
      expect(article).toHaveProperty("votes", expect.any(Number));
      expect(article).toHaveProperty("article_img_url", expect.any(String));
      expect(article).toHaveProperty("comment_count", expect.any(Number));
      expect(article).not.toHaveProperty("body");
    });
  });
 });
 });
 describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with a status of 200 when the comments for an article is found", () => {
    const testArticleId = 1;
    return request(app)
    .get(`/api/articles/${testArticleId}/comments`)
    .expect(200);
  });
  test("404: responds with a status of 404 when the article is not found", () => {
    const testArticleId = 40000;
    return request(app)
    .get(`/api/articles/${testArticleId}/comments`)
    .expect(404);
  });
  test("400: responds with a status of 400 when the article id is an invalid number", () => {
    const testArticleId = "Hello";
    return request(app)
    .get(`/api/articles/${testArticleId}/comments`)
    .expect(400);
  });
  test("200: respond with comments with the following properties when comments for an article are found", () => {
    const testArticleId = 1;
    return request(app)
    .get(`/api/articles/${testArticleId}/comments`)
    .expect(200)
    .then((response) => {
      const {comments} = response.body;
      expect(comments.length).not.toEqual(0);
      comments.forEach((comment) => {
        expect(comment).toBeInstanceOf(Object);
        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("votes", expect.any(Number));
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment).toHaveProperty("author", expect.any(String));
        expect(comment).toHaveProperty("body", expect.any(String));
        expect(comment).toHaveProperty("article_id", expect.any(Number));
      });
    });
  });
  test("200: responds with comments sorted descending based on created_at when comments for an article are found", () => {
    const testArticleId = 1;
    return request(app)
    .get(`/api/articles/${testArticleId}/comments`)
    .expect(200)
    .then((response) => {
      const { comments } = response.body;
      expect(comments).toBeSortedBy('created_at', { descending: true });
    })
  });
 });
 describe("POST /api/articles/:article_id/comments", () => {
  test("201: adding a valid comment for existing article responds with status 201", () => {
    const testArticleId = 4;
    const requestBody = {
      username: 'icellusedkars',
      body: 'Lobster pot'
    };
    return request(app)
     .post(`/api/articles/${testArticleId}/comments`)
     .send(requestBody)
     .expect(201);
  });
  test("201: adding a valid comment for existing article responds with added comment", () => {
    const testArticleId = 4;
    const requestBody = {
      username: 'icellusedkars',
      body: 'Lobster pot'
    };

    return request(app)
     .post(`/api/articles/${testArticleId}/comments`)
     .send(requestBody)
     .expect(201)
     .then((response) => {
        const comment = response.body.comment;
        expect(comment).toHaveProperty('article_id', testArticleId);
        expect(comment).toHaveProperty('author', requestBody.username);
        expect(comment).toHaveProperty('body', requestBody.body);
        expect(comment).toHaveProperty('votes', 0);
     });
  });
  test("400: adding a valid comment for an article that does not exist responds with status 400", () => {
    const testArticleId = 4000;
    const requestBody = {
      username: 'icellusedkars',
      body: 'Lobster pot'
    };
    return request(app)
     .post(`/api/articles/${testArticleId}/comments`)
     .send(requestBody)
     .expect(400);
  });
  test("400: adding a valid comment for a user that does not exist responds with status 400", () => {
    const testArticleId = 4;
    const requestBody = {
      username: 'notrealuser',
      body: 'Lobster pot'
    };
    return request(app)
     .post(`/api/articles/${testArticleId}/comments`)
     .send(requestBody)
     .expect(400);
  });
  test("400: adding a valid comment with an article id that is an invalid number responds with a status of 400", () => {
    const testArticleId = "hello";
    const requestBody = {
      username: 'icellusedkars',
      body: 'Lobster pot'
    };
    return request(app)
     .post(`/api/articles/${testArticleId}/comments`)
     .send(requestBody)
     .expect(400);
  });
  test("400: adding a comment missing a username responds with a status of 400", () => {
    const testArticleId = 4;
    const requestBody = {
      body: 'Lobster pot'
    };
    return request(app)
     .post(`/api/articles/${testArticleId}/comments`)
     .send(requestBody)
     .expect(400);
  });
  test("400: adding a comment missing a body responds with a status of 400", () => {
    const testArticleId = 4;
    const requestBody = {
      username: 'icellusedkars'
    };
    return request(app)
     .post(`/api/articles/${testArticleId}/comments`)
     .send(requestBody)
     .expect(400);
  });
 })
 describe("Error handling", () => {
  test("404:route that does not exist returns 404", () => {
    return request(app).get("/notARoute").expect(404);
  });
 });
});
