const express = require ("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const { 
        getArticleById, 
        getAllArticles, 
        getAllCommentsByArticleId, 
        postCommentForArticle, 
        patchArticleByArticleId 
    } = require("./controllers/articles.controller");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index.js');
const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentForArticle);

app.patch("/api/articles/:article_id", patchArticleByArticleId);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;