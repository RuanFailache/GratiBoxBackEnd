import supertest from 'supertest';
import bcrypt from 'bcrypt';

import app from '../../src/app.js';
import connection from '../../src/database/database.js';

export const newUserRegisterToTest = () => connection.query(`
    INSERT INTO users (
      name,
      email,
      password
    ) VALUES (
      'Bernardo',
      'bernardo.filho@test.com',
      $1
    ) RETURNING *;
  `, [bcrypt.hashSync('@Testando123', 12)]);

export const postTestUserToSignInRoute = (body) => (
  supertest(app).post('/sign-in').send(body)
);
