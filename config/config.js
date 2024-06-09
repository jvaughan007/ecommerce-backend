require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres"
  },
  test: {
    username: "your name",
    password: "your password",
    database: "your db name",
    host: "your host",
    dialect: "postgres"
  },
  production: {
    username: "your name",
    password: "your password",
    database: "your db name",
    host: "your host",
    dialect: "postgres"
  }
}
