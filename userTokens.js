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
    const numUsers = +res.rows[0].count;
    console.log(numUsers);
    return numUsers;
  }
  


async function refundTokens(tokensToRefund,numUsers) {
    
    if (numUsers !== 0 && !isNaN(tokensToRefund)) {
      // Calculate amount of tokens to give to each user
     const tokensPerUser = Math.round(tokensToRefund / numUsers);
    
      // Update tokens for all users
      const query = `UPDATE users SET tokens = tokens + $1`;
      await pool.query(query, [tokensPerUser]);
    }
  }
  

async function tool(){

   /* // Get number of users
  const numUsers = await countUsers();
  refundTokens(numUsers);*/


// Get current date
const currentDate = new Date();

// Check if it's the first of the month
if (currentDate.getDate() === 1) {
  const numUsers = await countUsers();
  // Calculate number of tokens to refund (80% of tokens)
  const tokensToRefund = 0.8 * numUsers * 100;
  // Store number of tokens to refund
  localStorage.setItem('tokensToRefund', tokensToRefund);
}

// Check if it's the last day of the month
if (currentDate.getDate() === new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()) {
  // Get number of tokens to refund from local storage
  const tokensToRefund = localStorage.getItem('tokensToRefund');
  // Get number of users
  const numUsers = await countUsers();
  refundTokens(tokensToRefund, numUsers);
}
    }
tool();
