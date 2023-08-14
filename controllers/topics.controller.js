const { selectTopics } = require("../models/topics.model");

exports.getAllTopics = (request, response, next) => {
    const {slug, description } = request.query;
    selectTopics(slug, description)
    .then((topics) => {
       response.status(200).send({topics}); 
    })
    .catch(next);
};
