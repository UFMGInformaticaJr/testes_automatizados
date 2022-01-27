function errorHandler(error, req, res, next) {
  let message = error.message;
  let status = 500; // Internal Server Error

  if (error.name === 'InvalidParamsError') {
    status = 400; // Bad Request
  }

  if (error.name === 'NotFoundError') {
    status = 404;
  }

  if (error.name === 'NotAuthorizedError') {
    status = 401; // Unauthorized
  }

  if (error.name === 'AccessDeniedError') {
    status = 403; // Forbidden
  }

  if (error.name === 'MediaTypeError') {
    status = 415; // Unsupported Media Type
  }

  res.status(status).json({error: message});
}

module.exports = errorHandler;
