const sendError = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
const handleValidationError = (res, statusCode, err) => {
  return res.status(statusCode).json({
    status: 'fail',
    message: err.passwordConfirm.message
  });
};

const handleDuplicateError = (res, statusCode, err) => {
  const key = Object.keys(err.keyValue)[0];
  if (key === 'email') {
    return res.status(statusCode).json({
      status: 'fail',
      message: 'Email Already exist...please use a different email.'
    });
  }
  const value = err.errmsg.match(/(["'](\\?.)*?\1)/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return res.status(statusCode).json({
    status: 'fail',
    message
  });
};
const handleCastError = (res, statusCode, err) => {
  return res.status(statusCode).json({
    status: 'fail',
    message: 'Wrong id passed in params'
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let copyErr = { ...err };
  copyErr.message = err.message;
  if (copyErr.name === 'ValidationError')
    handleValidationError(res, 400, copyErr);
  if (copyErr.code === 11000) handleDuplicateError(res, 400, copyErr);
  if (copyErr.name === 'CastError') handleCastError(res, 400, copyErr);
  sendError(copyErr, req, res);
};
