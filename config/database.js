require('dotenv').config();
const { Pool } = require('pg');

// Setup the connection pool
const pool = new Pool({
  user: process.env.DB_USER, // your database username
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, // your database name
  password: process.env.DB_PASSWORD, // your database password
  port: process.env.DB_PORT, // your database port, PostgreSQL default is 5432
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
