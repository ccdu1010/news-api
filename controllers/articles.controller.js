const { 
  selectArticlesByArticleId, 
  selectAllArticles, 
  selectAllCommentsByArticleId, 
  insertCommentForArticle
} = require("../models/articles.model");

exports.getArticleById = (request, response, next) => {
  const articleId = request.params.article_id;
  selectArticlesByArticleId(articleId)
  .then((article) => {
    response.status(200).send({article: article});
  })
  .catch(next);
};

exports.getAllArticles = (request, response, next) => {
  selectAllArticles()
  .then((articles) => {
    response.status(200).send({articles: articles});
  })
  .catch(next);
};

exports.getAllCommentsByArticleId = (request, response, next) => {
  const articleId = request.params.article_id;
  selectAllCommentsByArticleId(articleId)
  .then((comments) => {
    response.status(200).send({comments: comments});
  })
  .catch(next);
};

exports.postCommentForArticle = (request, response, next) => {
  const articleId = request.params.article_id;
  const newComment = request.body;

  insertCommentForArticle(articleId, newComment)
   .then((comment) => {
     response.status(201).send({comment: comment});
   })
   .catch(next);
};