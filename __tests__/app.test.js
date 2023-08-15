const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
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
  test("200: responds with a status of 200", () => {
    return request(app).get("/api").expect(200);
  });
  test("200: responds with an accurate JSON object", () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then((response) => {
      const {endpoints} = response.body;
      for(const key in endpoints) {
        const value = endpoints[key];
        expect(value).toHaveProperty("description", expect.any(String));
        if(key != "GET /api") {
            expect(value).toHaveProperty("queries", expect.any(Array));
            expect(value).toHaveProperty("exampleResponse", expect.any(Object));
        }
        if(value.hasOwnProperty("requestBodyFormat")) {
            expect(value).toHaveProperty("requestBodyFormat", expect.any(Object));
        }
      };
    });
  });
 });
 describe("Error handling", () => {
  test("404:route that does not exist returns 404", () => {
    return request(app).get("/notARoute").expect(404);
  });
 });
})
