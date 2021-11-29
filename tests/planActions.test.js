import '../src/setup.js';

import faker from 'faker';

import * as planActionsFactory from './factories/planActionsFactory.js';

describe('POST /plan', () => {
  const emptyData = {
    plan: { type: '', receive: '', itensDelivery: '' },
    userInfo: {
      fullname: '',
      address: {
        street: '', number: '', city: '', state: '', zipCode: '',
      },
    },
  };

  test('Without authorization', async () => {
    const token = '';
    const body = planActionsFactory.createFakeBody();
    const result = await planActionsFactory.testPostRegisterPlan(body, token);
    expect(result.status).toEqual(401);
  });

  test('Empty input', async () => {
    const token = planActionsFactory.createSession();
    const result = await planActionsFactory.testPostRegisterPlan(emptyData, token);
    expect(result.status).toEqual(400);
  });
});
