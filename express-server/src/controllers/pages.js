// Importamos las funciones del modelo

const worksModel = require('../models/works');

async function serveWorkDetailPage(req, res) {
  if (isNaN(parseInt(req.params.id))) {
    return res.status(404).render('workNotFound');
  }

  const result = await worksModel.getFullInfo(req.params.id);

  try {
    if (!result) {
      res.status(404).render('workNotFound');
    } else {
      res.render('workDetail', result);
    }
  } catch (error) {
    return res.status(500).render('serverError');
  }
}

module.exports = { serveWorkDetailPage };
