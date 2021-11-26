import joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

export const validateUserInput = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const validateNewUserInput = joi.object({
  name: joi.string().min(3).pattern(/^[a-zA-z ]+$/).required(),
  email: joi.string().email().required(),
  password: passwordComplexity({
    min: 6,
    max: 32,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 6,
  }),
});
