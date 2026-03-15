const { getConnection } = require('./db');

async function read() {
  // 1. Conectarse a la base de datos.
  const conn = await getConnection();

  // 2-3. Preparar sentencia SQL (SELECT).
  const queryAllWorks = `SELECT * FROM works;`;

  // 3. Lanzar la sentencia SQL y obtener los resultados.
  const [results] = await conn.query(queryAllWorks);

  // 4. Cerrar la conexión con la base de datos.
  await conn.end();

  // 5. Devolver la información.
  return results;
}

async function get(id) {
  // 1. Conectarse a la base de datos.
  const conn = await getConnection();

  // 2. Preparar sentencia SQL (query).
  const selectOneWork = `
    SELECT * 
      FROM works
      WHERE id = ?`;

  // 3. Lanzar la sentencia SQL y obtener los resultados.
  const [results] = await conn.query(selectOneWork, [id]);

  // 4. Cerrar la conexión con la base de datos.
  await conn.end();

  return results[0];
}

async function getFullInfo(id) {
  // 1. Conectarse a la base de datos.
  const conn = await getConnection();

  // 2. Preparar sentencia SQL (query).
  const selectOneWork = `
    SELECT *
      FROM works w
        LEFT JOIN works_info i ON (w.id = i.work_id)
      WHERE w.id = ?`;

  // 3. Lanzar la sentencia SQL y obtener los resultados.
  const [results] = await conn.query(selectOneWork, [id]);

  // 4. Cerrar la conexión con la base de datos.
  await conn.end();

  return results[0];
}

async function create(data) {
  const conn = await getConnection();

  const insertAnime = `
    INSERT INTO works (title, description, user_id)
      VALUES (?, ?, ?);`;

  const [result] = await conn.execute(insertAnime, [
    data.title,
    data.description,
    data.user_id,
  ]);

  await conn.end();

  return result;
}

module.exports = { read, get, getFullInfo, create };
