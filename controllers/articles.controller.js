const articles = require("../db/data/test-data/articles");
const { selectArticlesByArticleId, selectAllArticles } = require("../models/articles.model");

exports.getArticleById = (request, response, next) => {
  const articleId = request.params.article_id;
  selectArticlesByArticleId(articleId)
  .then((article) => {
    if(!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`,
        });
    } else {
        response.status(200).send({article: article});
    }
  })
  .catch(next);
};

exports.getAllArticles = (request, response, next) => {
  selectAllArticles()
  .then((articles) => {
    if(!articles || articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No articles found`,
        });
    } else {
        response.status(200).send({articles: articles});
    }
  })
  .catch(next);
}

