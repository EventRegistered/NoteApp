module.exports.notFound = (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
};

// eslint-disable-next-line no-unused-vars
module.exports.errorHandler = (err, req, res, next) => {
  // log server-side error details (do not leak stack in production)
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
};