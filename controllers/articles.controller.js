const { selectArticlesByArticleId } = require("../models/articles.model");

const getArticleById = (request, response, next) => {
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

module.exports = { getArticleById }