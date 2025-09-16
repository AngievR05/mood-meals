function errorHandler(err, req, res, next) {
  console.error('🔥 Error:', err.stack || err.message);
  res.status(500).json({ msg: 'Server error', error: err.message });
}
module.exports = errorHandler;
