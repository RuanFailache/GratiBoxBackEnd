import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import connection from '../database/database.js';

import validateUserTryingToSignIn from '../schemas/signIn.schema.js';

const checkSignInAndSendToken = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  const { error } = validateUserTryingToSignIn.validate({
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

    if (!hasEmailInDatabase) {
      return res.sendStatus(404);
    }

    const passwordOfEmailInDatabase = result.rows[0].password;
    const checkValidationOfPassword = bcrypt.compareSync(password, passwordOfEmailInDatabase);

    if (!checkValidationOfPassword) {
      return res.sendStatus(404);
    }

    const { id } = result.rows[0];
    const token = uuid();

    await connection.query(`
      INSERT INTO sessions (
        id_user, token
      ) VALUES (
        $1, $2
      );
    `, [id, token]);

    return res.send({
      token,
      user: {
        idUser: result.rows[0].id,
        name: result.rows[0].name,
        idAddress: result.rows[0].id_address,
        idPlan: result.rows[0].id_plan,
      },
    });
  } catch {
    return res.sendStatus(500);
  }
};

export default checkSignInAndSendToken;
