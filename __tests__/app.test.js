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
      topics.forEach((topics) => {
        expect(topics).toHaveProperty("slug", expect.any(String));
        expect(topics).toHaveProperty("description", expect.any(String));
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
 describe("Error handling", () => {
  test("404:route that does not exist returns 404", () => {
    return request(app).get("/notARoute").expect(404);
  });
 });
});
