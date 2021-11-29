import supertest from 'supertest';
import faker from 'faker';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import app from '../../src/app.js';
import connection from '../../src/database/database.js';

export const createSession = async () => {
  const fakePassword = faker.internet.password();

  const userResult = await connection.query(
    'INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *;',
    [
      faker.name.findName(),
      faker.internet.email(),
      bcrypt.hashSync(fakePassword, 12),
    ],
  );

  const { id } = userResult.rows[0];
  const token = uuid();

  await connection.query(
    'INSERT INTO sessions (id_user, token) VALUES ($1, $2) RETURNING *;',
    [id, token],
  );

  return token;
};

const createFakePlan = async () => {
  const possiblePlanTypes = ['mensal', 'semanal'];
  const planType = possiblePlanTypes[Math.floor(Math.random() * 2)];

  const today = new Date();
  const todayWeekday = today.getDay();
  const possibleReceiveDays = [1, 3, 5];
  const receiveWeekday = possibleReceiveDays[Math.floor(Math.random() * 3)];
  const daysUntilReceive = todayWeekday < receiveWeekday
    ? todayWeekday - receiveWeekday
    : 7 + receiveWeekday - todayWeekday;
  const receiveDay = today.setDate(today.getDate() + daysUntilReceive);

  const result = await connection.query(
    'INSERT INTO plans (type, delivery_date) VALUES ($1, $2) RETURNING *;',
    [planType, receiveDay],
  );

  return result.rows[0];
};

const createFakeAddress = async () => {
  const result = await connection.query(
    'INSERT INTO address (street, number, city, state, zip_code) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
    [
      faker.address.streetName(),
      Math.floor(Math.random() * 1000),
      faker.address.cityName(),
      faker.address.state(),
      faker.address.zipCode(),
    ],
  );

  return result.rows[0];
};

export const createFakeBody = () => {
  const plan = createFakePlan();
  const fullname = faker.name.findName();
  const address = createFakeAddress();

  return {
    plan,
    userInfo: {
      fullname,
      address,
    },
  };
};

export const testPostRegisterPlan = (body, token) => (
  supertest(app)
    .post('/plan')
    .send(body)
    .set('Authorization', `Bearer ${token}`)
);
