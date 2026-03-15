const { getConnection } = require('./db');

async function get(email) {
  // 1. Connect to the database
  const conn = await getConnection();

  // 2.a. Check if an user exists with that email
  const selectOneUser = `
    SELECT * FROM users WHERE email = ?
  `;

  const [results] = await conn.query(selectOneUser, [email]);

  await conn.end();

  return results[0];
}

async function create(data, cryptedPass) {
  const conn = await getConnection();

  const insertOneUser = `
    INSERT INTO users (fullname, phone, email, password)
      VALUES (?, ?, ?, ?);`;

  const [result] = await conn.execute(insertOneUser, [
    data.fullname,
    data.phone,
    data.email,
    cryptedPass,
  ]);

  await conn.end();

  return result;
}

module.exports = { get, create };
