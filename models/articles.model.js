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

exports.selectAllArticles = () => {
  return db.query(`
    SELECT 
      articles.author, 
      articles.title, 
      articles.article_id, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      article_img_url, 
      COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`)
    .then(({rows}) => {
    return rows;
  });
}
