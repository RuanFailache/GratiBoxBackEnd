import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? 'env.test' : 'env';

dotenv.config({
  path: envFile,
});
