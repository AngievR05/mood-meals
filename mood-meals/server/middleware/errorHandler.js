module.exports = (err, req, res, next) => {
  console.error(err); // server-only log
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
};
