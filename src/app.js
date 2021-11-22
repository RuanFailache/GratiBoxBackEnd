import express from 'express';
import cors from 'cors';

import registerNewUser from './controllers/signUp.js';
import checkSignInAndSendToken from './controllers/signIn.js';
import registerNewPlan from './controllers/registerPlan.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/sign-up', registerNewUser);
app.post('/sign-in', checkSignInAndSendToken);
app.post('/plan', registerNewPlan);

export default app;
