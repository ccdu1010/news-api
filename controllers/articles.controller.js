const { selectArticlesByArticleId, selectAllArticles } = require("../models/articles.model");

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

