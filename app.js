const express = require("express");
const cors = require("cors");
const { getAllTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const {
  getArticleById,
  getAllArticles,
  getAllCommentsByArticleId,
  postCommentForArticle,
  patchArticleByArticleId,
} = require("./controllers/articles.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const { getAllUsers } = require("./controllers/users.controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentForArticle);
app.patch("/api/articles/:article_id", patchArticleByArticleId);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/users", getAllUsers);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
