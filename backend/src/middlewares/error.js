
export function errorHandler(err, _req, res, _next) {
  console.error(err);

  // Known application error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      ...(err.errors && {
        errors: err.errors,
      }),
    });
  }

  // Unknown / unexpected error
  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
}