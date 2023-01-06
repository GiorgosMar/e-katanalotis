const { Pool } = require('pg');

// Connection configuration
const config = {
  user: 'postgres',
  password: 'walter12@',
  host: 'localhost',
  database: 'newweb'
};

// Create a new connection pool
const pool = new Pool(config);

async function countUsers() {
  // Get number of users
  const query = `SELECT COUNT(*) as count FROM users`;
  const res = await pool.query(query);
  return res.rows[0].count;
}

async function refundTokens(numUsers) {
  // Calculate number of tokens to refund (80% of tokens)
  const tokensToRefund = 0.8 * numUsers * 100; // auto molis bgaloume kai to score tha allaksei 
  // Refund tokens to all users
  const query = `UPDATE users SET tokens = tokens + $1`;
  await pool.query(query, [tokensToRefund]);
}

// Get current date
const currentDate = new Date();

// Check if it's the first of the month
if (currentDate.getDate() === 1) {
  const numUsers = await countUsers();
  console.log(`Number of users: ${numUsers}`);
}
// Check if it's the last day of the month
if (currentDate.getDate() === new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()) {
  const numUsers = await countUsers();
  refundTokens(numUsers);
}