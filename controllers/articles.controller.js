const { 
  selectArticlesByArticleId, 
  selectAllArticles, 
  selectAllCommentsByArticleId, 
  insertCommentForArticle,
  updateArticleByArticleId
} = require("../models/articles.model");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticlesByArticleId(article_id)
  .then((article) => {
    response.status(200).send({article});
  })
  .catch(next);
};

exports.getAllArticles = (request, response, next) => {
  const {topic, sort_by, order} = request.query;
  selectAllArticles(topic, sort_by, order)
  .then((articles) => {
    response.status(200).send({articles: articles});
  })
  .catch(next);
};

exports.getAllCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  selectAllCommentsByArticleId(article_id)
  .then((comments) => {
    response.status(200).send({comments});
  })
  .catch(next);
};

exports.postCommentForArticle = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;

  insertCommentForArticle(article_id, newComment)
   .then((comment) => {
     response.status(201).send({comment});
   })
   .catch(next);
};

exports.patchArticleByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  updateArticleByArticleId(article_id, inc_votes)
  .then((article) => {
    response.status(200).send({article});
  })
  .catch(next);
}