const authModel = require('../models/auth');

const {
  sendJsonErrorData,
} = require('../views/json/error');

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.replace(/bearer /i, '');

  if (!token) {
    return sendJsonErrorData(res, 'Token not found');
  }

  const decoded = authModel.verifyTokenAndGetData(token);

  if (!decoded) {
    return sendJsonErrorData(res, 'Invalid Token');
  }

  req.user = decoded;
  
  next();
}

module.exports = {authenticateToken};