const express = require ("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const { getArticleById, getAllArticles, getAllCommentsByArticleId } = require("./controllers/articles.controller");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index.js');
const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);


app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;