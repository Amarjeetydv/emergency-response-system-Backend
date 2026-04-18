const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(client => {
    console.log(`✅ Connected to PostgreSQL database at ${process.env.DB_HOST}`);
    client.release();
  })
  .catch(err => {
    console.error('❌ PostgreSQL Connection Failed:');
    console.error(`   Host: ${process.env.DB_HOST}`);
    console.error(`   Error: ${err.message}`);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  execute: async (text, params) => {
    // Wrapper to mimic mysql2 return structure [rows, fields]
    const result = await pool.query(text, params);
    return [result.rows, result];
  }
};
