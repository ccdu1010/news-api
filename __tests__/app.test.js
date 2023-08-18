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
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("No article found for article_id: 40000")
    });
  });
  test("400: responds with a status of 400 when the article id is an invalid number", () => {
    const testArticleId = "Hello";
    return request(app)
    .get(`/api/articles/${testArticleId}`)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("The article_id 'Hello' is not a valid number");
    });
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
  test("404: responds with a status of 404 when the article is not found", () => {
    const testArticleId = 40000;
    return request(app)
    .get(`/api/articles/${testArticleId}/comments`)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("No article is found with article_id: 40000")
    });
  });
  test("400: responds with a status of 400 when the article id is an invalid number", () => {
    const testArticleId = "Hello";
    return request(app)
    .get(`/api/articles/${testArticleId}/comments`)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("The article_id 'Hello' is not a valid number")
    });
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
        expect(comment).toHaveProperty("article_id", 1);
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
     .expect(400)
     .then(({body}) => {
      expect(body.msg).toBe("Invalid input");
    });
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
     .expect(400)
     .then(({body}) => {
      expect(body.msg).toBe("Invalid input");
    });
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
     .expect(400)
     .then(({body}) => {
      expect(body.msg).toBe("Invalid input");
    });
  });
  test("400: adding a comment missing a username responds with a status of 400", () => {
    const testArticleId = 4;
    const requestBody = {
      body: 'Lobster pot'
    };
    return request(app)
     .post(`/api/articles/${testArticleId}/comments`)
     .send(requestBody)
     .expect(400)
     .then(({body}) => {
      expect(body.msg).toBe("A username is required");
    });
  });
  test("400: adding a comment missing a body responds with a status of 400", () => {
    const testArticleId = 4;
    const requestBody = {
      username: 'icellusedkars'
    };
    return request(app)
     .post(`/api/articles/${testArticleId}/comments`)
     .send(requestBody)
     .expect(400)
     .then(({body}) => {
      expect(body.msg).toBe("A body is required");
    });
  });
  test("201: adding a valid comment with acceptable properties and ignore the extra one", () => {
    const testArticleId = 4;
    const requestBody = {
      username: 'icellusedkars',
      body: 'Lobster pot',
      age: 38
    };

    return request(app)
     .post(`/api/articles/${testArticleId}/comments`)
     .send(requestBody)
     .expect(201)
     .then((response) => {
        const comment = response.body.comment;
        expect(comment).not.toHaveProperty('age', 38)
     });
  });
 });
 describe("PATCH /api/articles/:article_id", () => {
  test("200: patching an existing article with positive votes responds with article having incremented votes", () => {
    const testArticleId = 4;
    const requestBody = { inc_votes: 3 };
    const expectedVotes = 3;
    return request(app)
    .patch(`/api/articles/${testArticleId}`)
    .send(requestBody)
    .expect(200)
    .then((response) => {
      const { article }= response.body;
      expect(article).toHaveProperty("votes", expectedVotes);
      expect(article).toHaveProperty("author", expect.any(String));
      expect(article).toHaveProperty("title", expect.any(String));
      expect(article).toHaveProperty("article_id", testArticleId);
      expect(article).toHaveProperty("body", expect.any(String));
      expect(article).toHaveProperty("topic", expect.any(String));
      expect(article).toHaveProperty("created_at", expect.any(String));
      expect(article).toHaveProperty("article_img_url", expect.any(String));
    });
  });
  test("200: patching an existing article with negative votes responds with article having decremented votes", () => {
    const testArticleId = 4;
    const requestBody = { inc_votes: -12 };
    const expectedVotes = -12;
    return request(app)
    .patch(`/api/articles/${testArticleId}`)
    .send(requestBody)
    .expect(200)
    .then((response) => {
      const article = response.body.article;
      expect(article).toHaveProperty("votes", expectedVotes);
    });
  });
  test("404: responds with a status of 404 when the article is not found", () => {
    const testArticleId = 40000;
    const requestBody = { inc_votes: 5 };
    return request(app)
    .patch(`/api/articles/${testArticleId}`)
    .send(requestBody)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe(`No article found for article_id: ${testArticleId}`)
    });
  });
  test("400: responds with a status of 400 when the article id is an invalid number", () => {
    const testArticleId = "Hello";
    const requestBody = { inc_votes: -1 };
    return request(app)
    .patch(`/api/articles/${testArticleId}`)
    .send(requestBody)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Invalid input");
    });
  });
  test("400: responds with a status of 400 when the inc_votes property is missing", () => {
    const testArticleId = 4;
    const requestBody = { };
    return request(app)
    .patch(`/api/articles/${testArticleId}`)
    .send(requestBody)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("An inc_votes property is required");
    });
  });
  test("400: responds with a status of 400 when the inc_votes property is an invalid number", () => {
    const testArticleId = 4;
    const requestBody = { inc_votes: "cats" };
    return request(app)
    .patch(`/api/articles/${testArticleId}`)
    .send(requestBody)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Invalid input");
    });
  });
 });
 describe("DELETE /api/comments/:comment_id", () => {
  test("404: responds with a status of 404 when the comment is not found", () => {
    const testCommentId = 40000;
    return request(app)
    .delete(`/api/comments/${testCommentId}`)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("No comment found with comment_id: 40000")
    });
  });
  test("400: responds with a status of 400 when the comment id is an invalid number", () => {
    const testCommentId = "hello";
    return request(app)
    .delete(`/api/comments/${testCommentId}`)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Invalid input");
    });
  });
  test("204: deleting an existing comment responds with 204 and no content", () => {
    const testCommentId = 1;
    return request(app)
    .delete(`/api/comments/${testCommentId}`)
    .expect(204);
  });
  test("404: deleting an existing comment responds with 204 and deleting comment again returns 404", () => {
    const testCommentId = 1;
    return request(app)
    .delete(`/api/comments/${testCommentId}`)
    .expect(204)
    .then((response) => {
      expect(response.body).toEqual({});
      return request(app)
        .delete(`/api/comments/${testCommentId}`)
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("No comment found with comment_id: 1");
        });
    });
  });
 });
 describe("GET /api/users", () => {
  test("200: Getting users responds with 200 and an array of users with the expected properties", () => {
    return request(app)
    .get(`/api/users`)
    .expect(200)
    .then((response) => { 
      const {users} = response.body;
      expect(users).toBeInstanceOf(Array);
      expect(users.length).not.toEqual(0);
      users.forEach((article) => {
        expect(article).toBeInstanceOf(Object);
        expect(article).toHaveProperty("username", expect.any(String));
        expect(article).toHaveProperty("name", expect.any(String));
        expect(article).toHaveProperty("avatar_url", expect.any(String));
      });
    });
  });
  test("200: responds with an array of users with correct data", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then((response) => {
      const {users} = response.body;
      expect(users).toEqual(userData);
    });  
  });
 });
 describe("Error handling", () => {
  test("404:route that does not exist returns 404", () => {
    return request(app).get("/notARoute").expect(404);
  });
 });
})
