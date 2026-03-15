function sendJsonArray(res, data) {
  return res.json({
    success: true,
    data: data,
  });
}

function sendJsonObject(res, data) {
  return res.json({
    success: true,
    data: data,
  });
}

function sendJsonToken(res, tokenJWT) {
  return res.json({
      success: true,
      token: tokenJWT,
    });
}

module.exports = { sendJsonArray, sendJsonObject, sendJsonToken };
