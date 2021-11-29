import express from 'express';
import cors from 'cors';

import * as userController from './controllers/userController.js';
import * as planActionsController from './controllers/planActionsController.js';

import authService from './middlewares/checkAuth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/sign-up', userController.signUp);
app.post('/sign-in', userController.signIn);
app.post('/plan', authService, planActionsController.registerNewPlan);

export default app;
