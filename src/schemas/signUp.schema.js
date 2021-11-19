import joi from 'joi';
import joiPassword from 'joi-password';

const validateNewUserData = joi.object({
  name: joi.string().min(3).pattern(/^[a-zA-z ]+$/).required(),
  email: joi.string().email().required(),
  password: joiPassword.string()
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfSpecialCharacters(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
});

export default validateNewUserData;
