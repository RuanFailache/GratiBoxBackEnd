import supertest from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '../../src/app.js';
import connection from '../../src/database/database.js';

import { newUserRegisterToTest } from './signIn.factyory.js';

export const registerNewPlan = async () => {
  const user = await newUserRegisterToTest();

  await connection.query(`
    INSERT INTO sessions (
      id_user,
      token
    ) VALUES (
      $1, $2
    );
  `, [user.rows[0].id, uuid()]);

  await connection.query(`
    INSERT INTO plans (
      type,
      signature_date,
      delivery_date
    ) VALUES (
      $1,
      CURRENT_DATE,
      $2
    ) RETURNING *;
  `, ['mensal', new Date()]);

  await connection.query(`
    INSERT INTO address (
      street,
      number,
      city,
      zip_code,
      state
    ) VALUES (
      'Abobrinha verde',
      123,
      'Uma cidade',
      '13273412',
      'PA'
    );
  `);

  return user.rows[0].id;
};

export const getUserTestToken = async (idUser) => (
  connection.query(
    'SELECT * FROM sessions WHERE id_user = $1;',
    [idUser],
  )
);

export const postTestPlanToPlanRoute = (body, config) => (
  supertest(app).post('/plan').send(body, config)
);
