exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
    const invalid_text_representation = '22P02';
    const foreign_key_violation = '23503';
    const undefined_column = '42703';
    const syntax_error = '42601';
    if (err.code === foreign_key_violation || 
        err.code === invalid_text_representation ||
        err.code === undefined_column ||
        err.code === syntax_error) {
        res.status(400).send({ msg: 'Invalid input' });
    } else next(err);
  };

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
};