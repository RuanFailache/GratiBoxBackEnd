import supertest from 'supertest';
import faker from 'faker';

import app from '../../src/app.js';

const name = faker.name.findName();

export const createFakerUserToSignUp = {
  name,
  email: faker.internet.email(name),
  password: faker.internet.password(),
};

export const postTestUserToSignUpRoute = (body) => (
  supertest(app).post('/sign-up').send(body)
);
