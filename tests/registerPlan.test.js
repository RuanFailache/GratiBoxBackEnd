import '../src/setup.js';

import connection from '../src/database/database.js';

import {
  getUserTestToken,
  registerNewPlan,
  postTestPlanToPlanRoute,
} from './factories/registerPlan.factory.js';

describe('POST /plan', () => {
  const emptyBody = {
    plan: {
      type: '',
      receive: '',
      itensDelivery: [],
    },
    userInfo: {
      fullname: '',
      address: {
        street: '',
        number: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
  };

  const validBody = {
    plan: {
      type: 'semanal',
      receive: 'Segunda',
      itensDelivery: ['Chá'],
    },
    userInfo: {
      fullname: 'Bernardo Campos Filho',
      address: {
        street: 'Abobrinha verde',
        number: 123,
        city: 'Uma cidade',
        state: 'PA',
        zipCode: '13273412',
      },
    },
  };

  let idUser;

  beforeAll(async () => {
    await connection.query('DELETE FROM plan_products;');
    await connection.query('DELETE FROM sessions;');
    await connection.query('DELETE FROM users;');
    await connection.query('DELETE FROM plans;');
    await connection.query('DELETE FROM address;');
    idUser = await registerNewPlan();
  });

  afterAll(() => {
    connection.end();
  });

  test('Empty receive delivery pattern', async () => {
    const result = await postTestPlanToPlanRoute(emptyBody);
    expect(result.status).toEqual(400);
  });

  test('Empty receive delivery list item', async () => {
    const result = await postTestPlanToPlanRoute(emptyBody);
    expect(result.status).toEqual(400);
  });

  test('Invalid delivery date', async () => {
    const { plan, userInfo } = validBody;
    const result = await postTestPlanToPlanRoute({
      plan: {
        ...plan,
        itensDelivery: [],
      },
      userInfo,
    });
    expect(result.status).toEqual(400);
  });

  test('Invalid item in delivery item list', async () => {
    const { plan, userInfo } = validBody;
    const result = await postTestPlanToPlanRoute({
      plan: {
        ...plan,
        itensDelivery: ['Abacate'],
      },
      userInfo,
    });
    expect(result.status).toEqual(400);
  });

  test('Invalid address', async () => {
    const { plan, userInfo } = validBody;
    const { address } = userInfo;
    const result = await postTestPlanToPlanRoute({
      plan,
      userInfo: {
        ...userInfo,
        address: {
          ...address,
          number: 'olá',
        },
      },
    });
    expect(result.status).toEqual(400);
  });

  test('Without authorization', async () => {
    const result = await postTestPlanToPlanRoute(validBody);
    expect(result.status).toEqual(401);
  });

  test('Successuful register of new plan', async () => {
    const tokenResult = await getUserTestToken(idUser);
    const { token } = tokenResult.rows[0];
    const result = await postTestPlanToPlanRoute(validBody)
      .set('authorization', `Bearer ${token}`);
    expect(result.status).toEqual(201);
  });
});

describe('GET /plan', () => {});
