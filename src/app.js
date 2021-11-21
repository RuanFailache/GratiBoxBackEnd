import express from 'express';
import cors from 'cors';

import registerNewUser from './controllers/signUp.js';
import checkSignInAndSendToken from './controllers/signIn.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/sign-up', registerNewUser);
app.post('/sign-in', checkSignInAndSendToken);

export default app;
