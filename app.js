const express = require ("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const { getArticleById } = require("./controllers/articles.controller");
const { handleCustomErrors, handleServerErrors } = require('./errors/index.js');
const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);

// register middleware
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;