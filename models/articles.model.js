const format = require("pg-format");
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
      return Promise.reject({
        status: 404,
        msg: `No article found for article_id: ${articleId}`,
      })
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
      COUNT(comments.article_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`)
    .then(result => {
      if(result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'No articles found',
        })
      } else {
        return result.rows;
      }
    });
};

exports.selectAllCommentsByArticleId = (articleId) => {
  const parsedArticleId = parseInt(articleId);
  if(isNaN(parsedArticleId)) {
    return Promise.reject({
      status: 400,
      msg: `The article_id '${articleId}' is not a valid number`,
    });
  }

  return db.query(`
    SELECT * 
    FROM comments 
    WHERE article_id = $1
    ORDER BY created_at DESC`, [parsedArticleId])
    .then(result => {
      if(result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for article_id: ${articleId}`,
        })
      } else {
        return result.rows;
      }
    });
}

exports.insertCommentForArticle = (articleId, newComment) => {
  const parsedArticleId = parseInt(articleId);
  if(isNaN(parsedArticleId)) {
    return Promise.reject({
      status: 400,
      msg: `The article_id '${articleId}' is not a valid number`,
    });
  }
  const {username, body} = newComment;
  if(!username) {
    return Promise.reject({
      status: 400,
      msg: `A username is required`,
    });
  }
  if(!body) {
    return Promise.reject({
      status: 400,
      msg: `A body is required`,
    });
  }
  
  const queryStr = format(
    `INSERT INTO comments (article_id, author, body) VALUES %L Returning *`, 
    [[articleId, username, body]]
  );

  return db.query(queryStr).then(({ rows }) => {
    return rows[0];
  })
}
