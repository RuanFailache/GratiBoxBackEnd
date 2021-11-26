import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import * as userSchemas from '../schemas/userSchema.js';
import * as userRepository from '../repositories/userRepository.js';

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const { error } = userSchemas.validateUserInput.validate({
    email,
    password,
  });

  if (error) {
    return res.sendStatus(400);
  }

  try {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      return res.sendStatus(404);
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.sendStatus(404);
    }

    const token = uuid();

    await userRepository.createSession(user.id, token);

    return res.send({ token, user });
  } catch {
    return res.sendStatus(500);
  }
};

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = userSchemas.validateNewUserInput.validate({
    name,
    email,
    password,
  });

  if (error) {
    return res.sendStatus(400);
  }

  try {
    const hasUser = await userRepository.findUserByEmail(email);

    if (hasUser) {
      return res.sendStatus(404);
    }

    const hashPassword = bcrypt.hashSync(password, 12);

    await userRepository.registerNewUser(name, email, hashPassword);

    return res.sendStatus(201);
  } catch {
    return res.sendStatus(500);
  }
};
