// Importar la biblioteca de Express

const express = require('express');

// Importamos el middleware de auth

const { authenticateToken } = require('../middleware/auth');

// Importamos las funciones del modelo y las funciones de la vista de JSON

const worksModel = require('../models/works');
const { sendJsonArray, sendJsonObject } = require('../views/json/data');
const { sendJsonErrorData, sendJsonErrorServer } = require('../views/json/error');

// Creamos una pata del endpoint del servidor

const worksRouter = express.Router();

// GET  /api/works  -> JSON Array
worksRouter.get('/', async (req, res) => {
  try {
    const results = await worksModel.read();

    return sendJsonArray(res, results);
  } catch (error) {
    return sendJsonErrorServer(res, error.message);
  }
});

// GET  /api/works/:id   -> JSON Objeto

worksRouter.get('/:id', async (req, res) => {
  if (isNaN(parseInt(req.params.id))) {
    return sendJsonErrorData(res, 'Invalid ID');
  }

  try {
    const result = await worksModel.get(req.params.id);

    if (result) {
      return sendJsonObject(res, result);
    } else {
      return sendJsonErrorData(res, 'Work not found', 404);
    }
  } catch (error) {
    return sendJsonErrorServer(res, error.message);
  }
});

// POST /api/works  <-- JSON Objeto --> JSON success,id

worksRouter.post('/', authenticateToken, async (req, res) => {
  console.log('POST /api/works. Body:', req.body, ' Headers', req.headers);

  if (!req.body.titulo) {
    return sendJsonErrorData(res, 'Missing title');
  }

  try {
    console.log(req.user);

    const workData = {
      ...req.body,
      user_id: req.user.id,
    };

    const result = await worksModel.create(workData);

    if (result.affectedRows === 1) {
      workData.id = result.insertId;

      return sendJsonObject(res, workData);
    } else {
      return sendJsonErrorData(res, 'Invalid data');
    }
  } catch (error) {
    return sendJsonErrorServer(res, error.message);
  }
});

module.exports = worksRouter;
