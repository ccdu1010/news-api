const db = require("../db/connection");

exports.selectArticlesByArticleId = (articleId) => {
  const parsedArticleId = parseInt(articleId);
  if(isNaN(parsedArticleId)) {
    return Promise.reject({
      status: 400,
      msg: `The article_id '${articleId}' is not a valid number`,
    });
  }

  return db.query('SELECT * FROM articles WHERE article_id = $1;', [parsedArticleId])
   .then( result => {
    if(result.rows.length === 0) {
      return undefined;
    } else {
      return result.rows[0];
    }
  });
};
