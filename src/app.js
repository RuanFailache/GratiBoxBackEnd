import express from 'express';
import cors from 'cors';

import registerNewUser from './controllers/signUp.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/sign-up', registerNewUser);

export default app;
