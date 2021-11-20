import joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

const validateNewUserData = joi.object({
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

export default validateNewUserData;
