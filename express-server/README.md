# Steps to Create an Express Server

[![en](https://img.shields.io/badge/lang-en-green.svg)](https://github.com/vangamo/basic-and-opinated-web-templates/blob/master/express-server/README.md)
[![es_ES](https://img.shields.io/badge/lang-es--ES-green.svg)](https://github.com/vangamo/basic-and-opinated-web-templates/blob/master/express-server/README-es_ES.md)

## Installation

1. Create a folder for your project.
2. Open the folder.
3. Create the `src` folder and then create the file `src/index.js`.
4. Run `pnpm init` and answer its questions (pay attention to "package name" and "author") to generate the `package.json`.
   - Set the entrypoint to `src/index.js`.
5. Install the Express and CORS libraries:

   ```bash
   pnpm i express cors
   ```

6. Create a `.gitignore` file with `node_modules` on a single line.
7. Add the scripts to `package.json`:

   ```json
   "scripts": {
      "start": "node src/index.js",
      "dev": "node --watch src/index.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
   ```

## Minimal Server

Inside `src/index.js`, paste the following code:

```js
// Import the Express library

const express = require('express');

// Import the CORS library

const cors = require('cors');

// Create a variable with everything the server can do:

const app = express();

// Configure Express to work properly as an API

app.use(cors());
app.use(express.json({ limit: '25Mb' }));

// Start the server on port 3000:

const port = 3000;
app.listen(port, () => {
  console.log(
    `Right, the server is up and running: <http://localhost:${port}/>`,
  );
});
```

Save the file and start the server with `pnpm run dev` from the terminal. Then open a browser tab at `http://localhost:3000/` (it won't open or refresh automatically like React does!).

Getting an error like `Cannot GET /` is perfectly normal — you haven't added any endpoints yet...

## Endpoints

Endpoints are the points that can receive requests. They are the combination of a method and a path (**method+path**), and they define a function that your server uses to handle an incoming request.

To create GET endpoints (for APIs and static files):

```js
app.get('/path', (req, res) => {
  // Code that handles the GET request http://localhost:3000/path

  res.send('How do you do?');
});
```

To create POST endpoints (typically for APIs):

```js
app.post('/api/products', (req, res) => {
  // Code that handles the POST request http://localhost:3000/api/products

  res.send('[{},{}]');
});
```

For a "Not Found" error endpoint:

```js
app.get(/.*/, (req, res) => {
  // Code that handles the GET request http://localhost:3000/*

  res.status(404).send('Page not found.');
});
```

## Building an API

You need to think about which endpoints your API will expose: decide which entities (or tables — in APIs these are called domains) you'll manage, and which HTTP verbs (methods) you'll allow on each.

For example: if you're managing works and tasks with full CRUD operations on each, your endpoints will be:

- GET /api/works (to list)
- POST /api/work (to create a work)
- PUT /api/work (to update a work)
- DELETE /api/work (to delete a work)
- GET /api/tasks (to list)
- POST /api/task (to create a task)
- PUT /api/task (to update a task)
- DELETE /api/task (to delete a task)

Now write one endpoint function for each in `src/index.js`:

```js
app.get('/api/works', (res, res) => {
  // Code to list works
  // There should be a res.json(data) at the end
});

app.post('/api/works', (res, res) => {
  // Code to create a work
  // There should be a res.json(...) at the end
});

app.put('/api/works/:id', (res, res) => {
  // Code to update the work with the id specified in the path
  // There should be a res.json(...) at the end
});

app.delete('/api/works/:id', (res, res) => {
  // Code to delete the work with the id specified in the path
  // There should be a res.json(...) at the end
});
```

## Connecting to a MySQL Database

1. Install the `mysql2` and `dotenv` libraries:

   ```bash
   pnpm i mysql2 dotenv
   ```

2. Add the imports for both libraries to the imports section of `src/index.js`:

   ```js
   // Import the MySQL library

   const mysql = require('mysql2/promise');

   // Import the environment variables library

   require('dotenv').config();
   ```

3. Create a `.env` file at the root of the project. Write your database connection details there (host, user, password, schema):

   ```ini
   MYSQL_HOST='localhost'
   MYSQL_PORT=3306
   MYSQL_PASSWORD='your_password_here'
   MYSQL_USER='root'
   MYSQL_SCHEMA='animes'
   ```

   > NOTE: Remember to **add a line** with the filename `.env` to your `.gitignore` so that
   > **your passwords never end up in git**.

4. Add a section to `src/index.js` to configure the database connection:

   ```js
   // MySQL configuration

   const getConnection = async () => {
     const connectionData = {
       host: process.env.MYSQL_HOST || 'localhost',
       port: process.env.MYSQL_PORT || 3306,
       user: process.env.MYSQL_USER || 'root',
       password: process.env.MYSQL_PASSWORD || 'pass',
       database: process.env.MYSQL_SCHEMA || 'animes',
     };

     const conn = await mysql.createConnection(connectionData); // Create the connection box in Workbench
     await conn.connect(); // Click the connection box in Workbench

     return conn;
   };
   ```

5. In each API endpoint, follow these steps:
   1. Connect to the database.
   2. Prepare the SQL statement (query).
   3. Execute the SQL statement and get the results.
   4. Close the database connection.
   5. Return the data.

   Sometimes the SQL statement will be just a SELECT; other times you'll need several statements (e.g. a SELECT followed by an INSERT).

   You may also need to run some checks before firing off the statement.

Example:

```js
app.get('/api/tasks', async (req, res) => {
  // 1. Connect to the database
  const conn = await getConnection();

  // 2. Prepare a query = SELECT
  const querySelectTasks = `
          SELECT *
            FROM tasks`;

  // 3. Run the query
  const [results] = await conn.query(querySelectTasks);

  // 4. Close the connection
  await conn.end();

  // 5. Respond with the data
  res.json(results);
});
```

## Serving Static Files

To configure the path from the project root:

```js
app.use(express.static('./FRONTEND'));
```

To configure the path **properly**, relative to the folder containing `index.js`:

```js
app.use(express.static(path.join(__dirname, '..', 'FRONTEND')));
```

> NOTE: Remember to import Node's `path` library at the top of the file:
>
> ```js
> const path = require('node:path');
> ```

## Using ExpressJS as a Dynamic File Server with the EJS Template Engine

(What a title.)

1. Install the EJS template engine library:

   ```bash
   pnpm i ejs
   ```

2. Configure Express to act as a dynamic file server using EJS. In `src/index.js`, in the configuration section (where the `app.use` calls are), add:

   ```js
   // Configure Express to work properly as an API

   . . .

   // Configure Express to work as a dynamic file server
   app.set("view engine", "ejs");
   ```

   > NOTE: Oddly enough, you don't need to import the EJS library in `src/index.js`.
   > NOTE 2: CORS isn't needed for EJS templates (but it **is** needed if you have APIs).

3. Create a `/views` folder at the root of the project.
4. Add one `.ejs` file per page. Each file will contain HTML code with:
   - `<%= %>` tags for variables
   - `<% %>` tags for JS code that generates content
5. Create one GET endpoint per page. In each endpoint, send the response using `res.render()`:

   ```js
   res.render('fileName', { object: '', with: '', the: '', data: '' });
   ```

## Automated API Testing

1. Install Jest (for general testing) and Supertest (for testing Express):

   ```bash
     pnpm i -D jest supertest
   ```

2. Add a property to `package.json` to tell Jest we're using Node's JavaScript environment:

   ```json
     "jest": {
       "testEnvironment": "node"
     },
   ```

3. Add scripts to `package.json` to run the tests:

   ```json
     "scripts": {
        . . .
       "test": "jest --verbose",
       "test:watch": "jest --verbose --watchAll"
     },
   ```

   > NOTE: Watch out for trailing commas when separating JSON object properties.

4. Export the server from `/src/index.js`:

   ```js
   module.exports = app;
   ```

5. Create a `/tests/` folder and add your automated test files inside.

   For example, `/tests/minimalTest.test.js`:

   ```js
   const supertest = require("supertest");
   const server = require("../src/index");

   const api = supertest(server);

   describe("GET /api/list", () => {
     test("response to req with JSON content", async () => {
       const res = await api
         .get("/api/list")
         .expect(200)
         .expect("Content-Type", /json/);

        expect(res.body.success).toBe(true);
     });
   ```
