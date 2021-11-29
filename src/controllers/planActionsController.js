import * as planSchema from '../schemas/planSchema.js';
import * as planActionsRepository from '../repositories/planActionsRepository.js';

export const registerNewPlan = async (req, res) => {
  const { token } = await res.locals;

  if (!token) {
    return res.sendStatus(401);
  }

  const { plan, userInfo } = req.body;

  const planError = planSchema.validatePlanObject.validate(plan).error;
  const userInfoError = planSchema.validateUserInfoObject.validate(userInfo).error;

  if (planError || userInfoError) {
    return res.sendStatus(400);
  }

  try {
    const user = await planActionsRepository.findUserByToken(token);

    if (!user) {
      return res.sendStatus(401);
    }

    const newAddress = await planActionsRepository.registerNewAddress(
      userInfo.address.number,
      userInfo.address.street,
      userInfo.address.city,
      userInfo.address.state,
      userInfo.address.zipCode,
    );

    const newPlan = await planActionsRepository.registerNewPlan(
      plan.type,
    );

    await planActionsRepository.updateUserData(
      userInfo.fullname,
      newAddress.id,
      newPlan.id,
      user.id,
    );

    await planActionsRepository.registerProducts(
      plan.itensDelivery,
      newPlan.id,
    );

    return res.sendStatus(201);
  } catch {
    return res.sendStatus(500);
  }
};
