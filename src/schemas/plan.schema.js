import joi from 'joi';

const validateNewPlanInfo = joi.object({
  plan: joi.object({
    type: joi.string().pattern(/^(mensal|semanal)$/).required(),
    receive: joi.string().pattern(/^(Segunda|Quarta|Sexta|Dia 01|Dia 10|Dia 20)$/).required(),
    itensDelivery: joi.array()
      .items(joi.string().pattern(/^(Chá|Incenso|Produtos organicos)$/))
      .min(1)
      .max(3)
      .required(),
  }),
  userInfo: joi.object({
    fullname: joi.string().min(3).max(255).required(),
    address: joi.object({
      street: joi.string().min(3).max(255).required(),
      number: joi.number().integer().required(),
      city: joi.string().min(3).max(255).required(),
      zipCode: joi.string().min(8).max(8).required(),
      state: joi.string().min(2).max(2).required(),
    }),
  }),
});

export default validateNewPlanInfo;
