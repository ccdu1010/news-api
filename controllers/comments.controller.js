const { deleteCommentById } = require("../models/comments.model");

exports.deleteCommentById = (request, response, next) => {
  const commentId = request.params.comment_id;
  deleteCommentById(commentId)
  .then(() => {
    response.status(204).send();
  })
  .catch(next);
};
