// Importar la biblioteca de Express

const express = require('express');

// Importamos las funciones del modelo y las funciones de la vista de JSON

const userModel = require('../models/user');
const authModel = require('../models/auth');
const { sendJsonObject, sendJsonToken } = require('../views/json/data');
const {
  sendJsonErrorData,
  sendJsonErrorServer,
} = require('../views/json/error');

// Creamos una pata del endpoint del servidor

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
  // 0. Check te inputs

  if (!req.body.email) {
    return sendJsonErrorData(res, 'Missing email');
  }
  if (!req.body.pass) {
    return sendJsonErrorData(res, 'Missing password');
  }

  try {
    const resultComprobacion = await userModel.get(req.body.email);

    if (resultComprobacion) {
      return sendJsonErrorData(res, 'User already exists');
    }

    const userData = {
      fullname: req.body.fullname,
      phone: req.body.phone,
      email: req.body.email,
    };

    const encryptedPassword = await authModel.createPassword(req.body.pass);
    
    const result = await userModel.create(userData, encryptedPassword);

    console.log(result);

    if (result.affectedRows === 1) {
      userData.id = result.insertId;

      return sendJsonObject(res, userData);
    } else {
      return sendJsonErrorData(res, 'User cannot be created');
    }
  }
  catch( error ) {
    return sendJsonErrorServer(res, error.message);
  }
});

userRouter.post('/login', async (req, res) => {
  if (!req.body.email) {
    return sendJsonErrorData(res, 'Missing email');
  }
  if (!req.body.pass) {
    return sendJsonErrorData(res, 'Missing pass');
  }

  try {
    const userFound = await userModel.get(req.body.email);

    if (!userFound) {
      return sendJsonErrorData(res, 'Incorrect credentials', 404);
    }

    // userFound.contraseña === req.body.pass
    if (await authModel.areEqualPassWords(req.body.pass, userFound.contraseña)) {
      // Las contraseñas coinciden

      const datosToken = {
        id: userFound.id,
        nombre: userFound.nombre,
        email: userFound.email,
        rol: 'admin',
      };

      const tokenJWT = authModel.createToken(datosToken);

      return sendJsonToken(res, tokenJWT);
    } else {
      // Las contraseñas no coinciden

      return sendJsonErrorData(res, 'Incorrect credentials', 404);
    }
  }
  catch( error ) {
    return sendJsonErrorServer(res, error.message);
  }
});

userRouter.post('/verify', async (req, res) => {
  console.log('POST /api/user/verify. Body:', req.body, ' Headers', req.headers);

  const tokenUsuaria = req.headers.authorization.replace(/bearer /i, '');

  try {
    const userData = authModel.verifyTokenAndGetData(tokenUsuaria);

    console.log( userData );

    if( req.body.email && req.body.email !== userData.email ) {
      console.log('Email mismatch');

      return sendJsonErrorData(res, 'Invalid token');
    }

    return sendJsonObject(res, {token: tokenUsuaria});
  }
  catch( error ) {
    console.log(error.message);

    return sendJsonErrorData(res, 'Invalid token');
  }
});

module.exports = userRouter;
