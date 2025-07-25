const handleServerError = (res, err) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
};

module.exports = { handleServerError };