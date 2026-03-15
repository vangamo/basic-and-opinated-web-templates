# Pasos para crear un servidor Express

[![en](https://img.shields.io/badge/lang-en-green.svg)](https://github.com/vangamo/basic-and-opinated-web-templates/blob/main/express-server/README.md)
[![es_ES](https://img.shields.io/badge/lang-es--ES-green.svg)](https://github.com/vangamo/basic-and-opinated-web-templates/blob/main/express-server/README-es_ES.md)

## Instalación

1. Crear una carpeta donde irá el proyecto.
2. Abrir la carpeta
3. Crear la carpeta `src` y, luego, crear el fichero `src/index.js`.
4. Lanzar el comando `pnpm init` y contestar a sus preguntas (sobre todo al "package name" y "author") para crear el `package.json`.
   - En entrypoint vamos a poner `src/index.js`
5. Instalar la biblioteca de Express y CORS:

   ```bash
   pnpm i express cors
   ```

6. Creamos el `.gitignore` con una línea con `node_modules`.
7. Añadimos los scripts al `package.json`:

   ```json
   "scripts": {
      "start": "node src/index.js",
      "dev": "node --watch src/index.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
   ```

## Servidor mínimo

Dentro del fichero `src/index.js` ponemos el siguiente código:

```js
// Importar la biblioteca de Express

const express = require('express');

// Importar la biblioteca de CORS

const cors = require('cors');

// Crear una variable con todo lo que puede hacer el servidor:

const app = express();

// Configuramos Express para que funcione bien como API

app.use(cors());
app.use(express.json({ limit: '25Mb' }));

// Arrancar el servidor en el puerto 3000:

const port = 3000;
app.listen(port, () => {
  console.log(`Uh! El servidor ya está arrancado: <http://localhost:${port}/>`);
});
```

Guardamos y arrancamos el servidor con el comando `pnpm run dev` desde la terminal. Después, abrimos una página en el navegador con la dirección `http://localhost:3000/` (¡no se abre ni se actualiza automáticamente como en React!).

Es normal que de un error como `Cannot GET /` porque todavía no hemos añadido ningún endpoint...

## Endpoints

Los endpoints son los puntos a los que se pueden enviar las peticiones. Son la suma de un método más una ruta (**method+path**) y definen una función con la que nuestro servidor va a atender a una petición.

Para crear endpoints tipo GET (para APIS y ficheros):

```js
app.get('/ruta', (req, res) => {
  // Código que atiende a la petición GET http://localhost:3000/ruta

  res.send('¿Qué tal estás?');
});
```

Para crear endpoints tipo POST (normalmente para APIS):

```js
app.post('/api/products', (req, res) => {
  // Código que atiende a la petición POST http://localhost:3000/api/products

  res.send('[{},{}]');
});
```

Para un endpoint de "Error no encontrado":

```js
app.get(/.*/, (req, res) => {
  // Código que atiende a la petición GET http://localhost:3000/*

  res.status(404).send('Página no encontrada.');
});
```

## Para hacer un API

Tenemos que pensar qué endpoints vamos a implementar en nuestro API: pensar qué entidades (o tablas, que en APIs se llaman dominios) vamos a gestionar y qué verbos (o methods) vamos a permitir en cada una.

Por ejemplo: si vamos a gestionar trabajos (works) y tareas (tasks). Y vamos a realizar todas las operaciones de CRUD sobre cada una, nuestros endpoints serán:

- GET /api/works (para listar)
- POST /api/work (para crear un trabajo)
- PUT /api/work (para modificar un trabajo)
- DELETE /api/work (para borrar un trabajo)
- GET /api/tasks (para listar)
- POST /api/task (para crear una tarea)
- PUT /api/task (para modificar una tarea)
- DELETE /api/task (para borrar una tarea)

Ahora tenemos que hacer una función endpoint por cada uno en el fichero `src/index.js`:

```js
app.get('/api/works', (res, res) => {
  // Código para listar trabajos
  // Al final tendrá que haber un res.json(data)
});

app.post('/api/work', (res, res) => {
  // Código para crear un trabajo
  // Al final tendrá que haber un res.json(...)
});

app.put('/api/work/:id', (res, res) => {
  // Código para modificar un trabajo con el id indicado en la ruta
  // Al final tendrá que haber un res.json(...)
});

app.delete('/api/work/:id', (res, res) => {
  // Código para borrar un trabajo con el id indicado en la ruta
  // Al final tendrá que haber un res.json(...)
});
```

## Para conectarse a una base de datos MySQL

1. Instalamos las bibliotecas de código `mysql2` y `dotenv`:

   ```bash
   pnpm i mysql2 dotenv
   ```

2. Añadimos en la sección de los import de `src/index.js`, los imports para sendas bibliotecas:

   ```js
   // Importar la biblioteca de MySQL

   const mysql = require('mysql2/promise');

   // Importamos la biblioteca de variables de entorno

   require('dotenv').config();
   ```

3. Creamos un fichero `.env` en la raíz del proyecto. Vamos a escribir ahí los valores de los datos de conexión con la base de datos (host, usuario, contraseña, schema):

   ```ini
   MYSQL_HOST='localhost'
   MYSQL_PORT=3306
   MYSQL_PASSWORD='pon_aqui_tu_contraseña'
   MYSQL_USER='root'
   MYSQL_SCHEMA='animes'
   ```

   > NOTA: Recuerda **añadir una línea** con el nombre del fichero `.env` al fichero `.gitignore` para
   > que **no se suban tus contraseñas a git**.

4. Añadimos en `src/index.js` una sección para configurar la conexión con la base de datos:

   ```js
   // Configuración de MySQL

   const getConnection = async () => {
     const datosConexion = {
       host: process.env.MYSQL_HOST || 'localhost',
       port: process.env.MYSQL_PORT || 3306,
       user: process.env.MYSQL_USER || 'root',
       password: process.env.MYSQL_PASSWORD || 'pass',
       database: process.env.MYSQL_SCHEMA || 'animes',
     };

     const conn = await mysql.createConnection(datosConexion); // Crear la cajita de la conexión en el Workbench
     await conn.connect(); // Hacer click en la cajita de la conex del Workbench

     return conn;
   };
   ```

5. En cada endpoint del API daremos los siguientes pasos:
   1. Conectarse a la base de datos.
   2. Preparar sentencia SQL (query).
   3. Lanzar la sentencia SQL y obtener los resultados.
   4. Cerrar la conexión con la base de datos.
   5. Devolver la información.

   Habrá veces que la sentencia SQL sea solo un SELECT y habrá veces que necesitemos hacer varias sentencias SQL (SELECT y luego INSERT).

   También habrá veces que debamos hacer comprobaciones antes de lanzar la instrucción.

Ejemplo:

```js
app.get('/api/tasks', async (req, res) => {
  // 1. Nos hemos conectado con la bbdd
  const conn = await getConnection();

  // 2. Preparamos una query = SELECT
  const querySelectTasks = `
          SELECT p
            FROM tasks`;

  // 3. Lanzamos la query
  const [resultados] = await conn.query(querySelectTasks);

  // 4. Cerramos la conexión.
  await conn.end();

  // 5. Responder con los datos
  res.json(resultados);
});
```

## Para configurar el servidor de ficheros estáticos

Para configurar la ruta a partir de la raíz del proyecto:

```js
app.use(express.static('./FRONTEND'));
```

Para configurar la ruta **bien bien**, a partir de la carpeta donde está el fichero `index.js`:

```js
app.use(express.static(path.join(__dirname, '..', 'FRONTEND')));
```

> NOTA: Recuerda importar la biblioteca `path` de node al principio del fichero:
>
> ```js
> const path = require('node:path');
> ```

## Para configurar ExpressJS como un servidor de ficheros dinámicos usando el motor de plantillas EJS

(Vaya título me ha quedao)

1. Instalar la biblioteca del motor de plantillas EJS

   ```bash
   pnpm i ejs
   ```

2. Configuramos Express para que actúe como servidor de ficheros dinámicos usando EJS. En el fichero `src/index.js`, en la parte de configuración (donde están los `app.use`), añadimos:

   ```js
   // Configuramos Express para que funcione bien como API

   . . .

   // Configuramos Express para que funcione como servidor de ficheros dinámicos
   app.set("view engine", "ejs");
   ```

   > NOTA: Curiosamente, no hay que importar la biblioteca EJS en el fichero `src/index.js`.
   > NOTA.2: No haría falta usar CORS para las plantillas EJS (pero **SÍ** si tenemos APIs).

3. Creamos una carpeta en la raíz del proyecto que se llame `/views`.
4. Dentro, añadimos un fichero con extensión `.ejs` por cada página. Dentro contendrá código HTML con:
   - etiquetas `<%= %>` para variables
   - etiquetas `<% %>` para código JS que genera el contenido
5. Creamos tantos endpoints de tipo `GET` como páginas queramos crear. En cada endpoint, vamos a enviar la respuesta con el método `res.render()`:

   ```js
   res.render('nombreDelFichero', { objeto: '', con: '', los: '', datos: '' });
   ```

## Para hacer pruebas automáticas del API

1. Instala la biblioteca Jest (para hacer pruebas en general) y Supertest (para hacer pruebas de Express):

   ```bash
     pnpm i -D jest supertest
   ```

2. Añadimos una propiedad al fichero `package.json` para establecer en la configuración de Jest que estamos usando JavaScript desde Node:

   ```json
     "jest": {
       "testEnvironment": "node"
     },
   ```

3. Añadimos scripts al `package.json` para que se lance el comando de pruebas:

   ```json
     "scripts": {
        . . .
       "test": "jest --verbose",
       "test:watch": "jest --verbose --watchAll"
     },
   ```

   > NOTA: Cuidado con las comas para separar las propiedades de los objetos JSON.

4. Exportamos el servidor en el fichero `/src/index.js`:

   ```js
   module.exports = app;
   ```

5. Creamos la carpeta `/tests/` y añadimos ficheros de tests automáticos dentro.

   Por ejemplo, `/tests/minimalTest.test.js`:

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
