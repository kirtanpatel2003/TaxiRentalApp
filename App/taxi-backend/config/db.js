const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


pool.connect()
  .then(() => console.log('Connected to PostgreSQL 🚀'))
  .catch(err => console.error('Database connection error', err.stack));

module.exports = pool;