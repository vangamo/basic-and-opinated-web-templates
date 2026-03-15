// Importamos la biblioteca de contraseñas

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Importamos la biblioteca de tokens

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_PASSWORD || 'supersecret_password';

async function createPassword(pass) {
  const cryptedPass = await bcrypt.hash(req.body.pass, saltRounds);

  return cryptedPass;
}

async function areEqualPassWords(pass, cryptedPass) {
  return bcrypt.compare(pass, cryptedPass);
}

function createToken(payload) {
  return jwt.sign(payload, jwtSecret, {expiresIn: '30m'});
}

function verifyTokenAndGetData(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = {createPassword, areEqualPassWords, createToken, verifyTokenAndGetData};