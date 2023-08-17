exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
    const foreign_key_violation = '23503';
    if (err.code === foreign_key_violation) {
        res.status(400).send({ msg: 'Invalid input' });
    } else next(err);
  };

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
};