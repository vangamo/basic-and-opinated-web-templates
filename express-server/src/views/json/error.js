function sendJsonErrorData(res, message, status = 401) {
  return res.status(status).json({
    success: false,
    error: message,
  });
}

function sendJsonErrorServer(res, message) {
  return res.status(500).json({
    success: false,
    error: message,
  });
}

module.exports = { sendJsonErrorData, sendJsonErrorServer };
