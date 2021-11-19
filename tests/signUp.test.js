import '../src/setup.js';

import connection from '../src/database/database.js';

import {
  createFakerUserToSignUp,
  postTestUserToSignUpRoute,
} from './factories/signUp.factory.js';

describe('POST /sign-up', () => {
  const emptyBody = {
    name: '',
    email: '',
    password: '',
  };

  const fakeUser = createFakerUserToSignUp;

  beforeAll(async () => {
    await connection.query('DELETE FROM users;');
    await connection.query(`
      INSERT INTO users (
        name,
        email,
        password
      ) VALUES (
        'Manoel Costa Ribeiro',
        'manoel.ribeiro@test.com',
        'UmSimplesTeste!123'
      );
    `);
  });

  afterAll(() => {
    connection.end();
  });

  test('Invalid sign up data', async () => {
    const result = await postTestUserToSignUpRoute(emptyBody);
    expect(result.status).toEqual(400);
  });

  test('Invalid password length', async () => {
    const result = await postTestUserToSignUpRoute({
      ...fakeUser,
      password: '123',
    });
    expect(result.status).toEqual(400);
  });

  test('Invalid password format', async () => {
    const result = await postTestUserToSignUpRoute({
      ...fakeUser,
      password: 'abc123',
    });
    expect(result.status).toEqual(400);
  });

  test('Invalid email format', async () => {
    const result = await postTestUserToSignUpRoute({
      ...fakeUser,
      email: 'laranja',
    });
    expect(result.status).toEqual(400);
  });

  test('Invalid name length', async () => {
    const result = await postTestUserToSignUpRoute({
      ...fakeUser,
      name: 'eu',
    });
    expect(result.status).toEqual(400);
  });

  test('Invalid name format', async () => {
    const result = await postTestUserToSignUpRoute({
      ...fakeUser,
      name: '123456',
    });
    expect(result.status).toEqual(400);
  });

  test('Existing email in database', async () => {
    const result = await postTestUserToSignUpRoute({
      name: 'Manoel Coelho Ribeiro Jr',
      email: 'manoel.ribeiro@test.com',
      password: '@Testando123',
    });
    expect(result.status).toEqual(404);
  });

  test('Successuful sign up', async () => {
    const result = await postTestUserToSignUpRoute({
      ...fakeUser,
      password: '@Testando123',
    });
    expect(result.status).toEqual(201);
  });
});
