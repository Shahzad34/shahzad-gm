export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
}

export function errorHandler(err, req, res, next) {
  console.error("[error]", err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "Something went wrong on the server." : err.message,
  });
}
