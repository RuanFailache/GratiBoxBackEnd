import pg from 'pg';

const { Pool } = pg;

let databaseConfig;

if (process.env.NODE_ENV === 'production') {
  databaseConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
  databaseConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
}

const connection = new Pool(databaseConfig);

export default connection;
