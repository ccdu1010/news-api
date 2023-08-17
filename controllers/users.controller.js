const { selectUsers } = require("../models/users.model");

exports.getAllUsers = (request, response, next) => {
    selectUsers()
    .then((users) => {
       response.status(200).send({users: users}); 
    })
    .catch(next);
};
