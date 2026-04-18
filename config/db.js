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
    // Convert MySQL '?' placeholders to PostgreSQL '$1, $2...'
    let index = 1;
    const pgText = text.replace(/\?/g, () => `$${index++}`);
    const result = await pool.query(pgText, params);
    // Return [rows, result] to maintain partial compatibility with mysql2
    return [result.rows, result];
  }
};
