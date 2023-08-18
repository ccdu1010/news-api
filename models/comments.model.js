const db = require("../db/connection");

exports.deleteCommentById = (commentId) => {
  return db.query(`
    DELETE FROM comments 
    WHERE comment_id = $1 
    RETURNING comment_id;`, [commentId])
    .then(({rows}) => {
      if(rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found with comment_id: ${commentId}`,
        })
      }
    });
};
