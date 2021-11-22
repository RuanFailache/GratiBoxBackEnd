import supertest from 'supertest';
import dayjs from 'dayjs';

import app from '../../src/app.js';
import connection from '../../src/database/database.js';

import { newUserRegisterToTest } from './signIn.factyory.js';

export const registerNewPlan = async () => {
  const user = await newUserRegisterToTest();

  const plan = await connection.query(`
    INSERT INTO plans (
      type,
      signature_date,
      delivery_date
    ) VALUES (
      $1,
      CURRENT_DATE,
      $2
    ) RETURNING *;
  `, ['mensal', dayjs().add(7, 'day')]);

  await connection.query(
    'UPDATE users SET id_plan = $1, fullname = $2 WHERE id = $3;',
    [plan.rows[0].id, 'Bernardo Campos Filho', user.rows[0].id],
  );

  await connection.query(`
    INSERT INTO plan_products (
      id_plan,
      id_product
    ) VALUES ($1, 2), ($1, 3);
  `, [plan.rows[0].id]);

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
};

export const getUserTestToken = async () => (
  (await connection.query(
    'SELECT token FROM sessions WHERE email = $1;',
    ['bernardo.filho@test.com'],
  )).rows[0]
);

export const postTestPlanToPlanRoute = (body, config) => (
  supertest(app).post('/plan').send(body, config)
);
