// ------------------------------------------
// ----------  IMPORTS SECTION  ----------
// ------------------------------------------

// Import the Express library

const express = require('express');

// Import the CORS library

const cors = require('cors');

// Import path to build routes to folders (for static files)

const path = require('node:path');

// Import the environment variables library

require('dotenv').config();

// -----------------------------------------------------------
// ----------  EXPRESS CONFIGURATION SECTION  ----------
// -----------------------------------------------------------

// Create a variable with everything the server can do:

const server = express();

// Set up Express to work properly as an API

server.use(cors());
server.use(express.json({ limit: '25Mb' }));

// Set up Express to work as a dynamic file server

server.set('view engine', 'ejs'); // No import needed!
server.set('views', path.join(__dirname, 'views', 'ejs'));

// -----------------------------------------
// ----------    START EXPRESS    ----------
// -----------------------------------------

// Start the server on port 3000:

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Wow! The server has started at <http://localhost:${port}/>`);
});

// --------------------------------------------
// ----------   ENDPOINTS SECTION    ----------
// --------------------------------------------

// ----------------------------------
// WORKS ENDPOINTS (RESTful API)
//  - GET  /api/works  -> JSON Array
//  - GET  /api/works/:id   -> JSON Object
//  - POST /api/work  <-- JSON Object --> JSON success,id

const worksController = require('./controllers/works');
server.use('/api/works', worksController);

// ----------------------------------------------
// REGISTER AND LOGIN ENDPOINTS (RESTful API)
//  - POST /api/user/register  -> JSON success
//  - POST /api/user/login  -> JSON token
//  - POST /api/user/verify  -> JSON success

const userController = require('./controllers/user');
server.use('/api/user', userController);

// -------------------------------------------------
// ENDPOINTS FOR THE DYNAMIC FILE SERVER

// GET  /work/:id   -> HTML (page with the anime details)

const { serveWorkDetailPage } = require('./controllers/pages');

server.get('/work/:id', serveWorkDetailPage);

// --------------------------------------------------------
// ----------     STATIC FILE SERVER SECTION     ----------
// --------------------------------------------------------

// STATIC FILE SERVER FOR EJS

server.use(express.static(path.join(__dirname, '..', 'static-server-assets')));

// STATIC FILE SERVER FOR REACT

server.use(express.static(path.join(__dirname, '..', 'static-server-frontend')));
server.get(/.*/, (req,res) => {
  res.sendFile(path.join(__dirname, '..', 'static-server-frontend', 'index.html'));
});

module.exports = server;
