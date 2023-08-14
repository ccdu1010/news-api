const { selectApi } = require("../models/api.model");

exports.getApi = (request, response, next) => {
    selectApi()
    .then((endpoints) => {
       response.status(200).send({endpoints}); 
    })
    .catch(next);
};
