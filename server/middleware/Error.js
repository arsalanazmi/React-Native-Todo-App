const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.StatusCode = err.StatusCode || 500;

  res.status(err.StatusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;
