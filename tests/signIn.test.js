import '../src/setup.js';

import connection from '../src/database/database.js';

import {
  postTestUserToSignInRoute,
  newUserRegisterToTest,
} from './factories/signIn.factyory.js';

describe('POST /sign-in', () => {
  const emptyBody = {
    email: '',
    password: '',
  };

  beforeAll(async () => {
    await connection.query('DELETE FROM sessions;');
    await connection.query('DELETE FROM users;');
    await newUserRegisterToTest();
  });

  afterAll(() => {
    connection.end();
  });

  test('Empty data on inputs', async () => {
    const result = await postTestUserToSignInRoute(emptyBody);
    expect(result.status).toEqual(400);
  });

  test('Invalid login data - email', async () => {
    const result = await postTestUserToSignInRoute({
      email: 'testonaldo@test.com',
      password: '@Testando123',
    });
    expect(result.status).toEqual(404);
  });

  test('Invalid login data - password', async () => {
    const result = await postTestUserToSignInRoute({
      email: 'bernardo.filho@test.com',
      password: '@Testando321',
    });
    expect(result.status).toEqual(404);
  });

  test('Successuful sign in', async () => {
    const result = await postTestUserToSignInRoute({
      email: 'bernardo.filho@test.com',
      password: '@Testando123',
    });
    expect(result.status).toEqual(200);
  });
});
