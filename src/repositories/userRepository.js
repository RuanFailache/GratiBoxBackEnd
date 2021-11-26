import connection from '../database/database.js';

export const findUserByEmail = async (email) => {
  const userResult = await connection.query(
    'SELECT * FROM users WHERE email = $1 LIMIT 1;',
    [email],
  );

  return userResult.rowCount > 0 ? userResult.rows[0] : false;
};

export const createSession = (id, token) => (
  connection.query(`
      INSERT INTO sessions (
        id_user, token
      ) VALUES (
        $1, $2
      );
    `, [id, token])
);

export const registerNewUser = (name, email, password) => (
  connection.query(`
      INSERT INTO users (
        name, email, password
      ) VALUES (
        $1, $2, $3
      );
    `, [name, email, password])
);
