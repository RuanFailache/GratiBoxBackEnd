import bcrypt from 'bcrypt';

import connection from '../database/database.js';

import validateNewUserData from '../schemas/signUp.schema.js';

const registerNewUser = async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = validateNewUserData.validate({
    name,
    email,
    password,
  });

  if (error) {
    return res.sendStatus(400);
  }

  try {
    const result = await connection.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1;',
      [email],
    );

    const hasEmailInDatabase = result.rowCount > 0;

    if (hasEmailInDatabase) {
      return res.sendStatus(404);
    }

    const hashPassword = bcrypt.hashSync(password, 12);

    await connection.query(`
      INSERT INTO users (
        name, email, password
      ) VALUES (
        $1, $2, $3
      );
    `, [name, email, hashPassword]);

    return res.sendStatus(201);
  } catch {
    return res.sendStatus(500);
  }
};

export default registerNewUser;
