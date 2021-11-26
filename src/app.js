import express from 'express';
import cors from 'cors';

import * as userController from './controllers/userController.js';
import registerNewPlan from './controllers/registerPlan.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/sign-up', userController.signUp);
app.post('/sign-in', userController.signIn);
app.post('/plan', registerNewPlan);

export default app;
