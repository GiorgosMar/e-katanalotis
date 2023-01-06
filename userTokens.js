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
  


async function refundTokens(numUsers) {
    //console.log(numUsers);
    // Calculate number of tokens to refund (80% of tokens)
    const tokensToRefund = 0.8 * numUsers * 100;
    //console.log(tokensToRefund);
    // Refund tokens to all users
    const query = `UPDATE users SET tokens = tokens + $1`;
    if (numUsers !== 0 && !isNaN(tokensToRefund)) {
       const value = Math.round(tokensToRefund / numUsers);
       console.log(value);
        await pool.query(query, [value]);    
    }
  }
  

async function tool(b){
     b = await countUsers();
}


let a;
// Uncomment this line to manually trigger the user count
tool(a);
console.log(a);
//console.log(a);
// Get current date
const currentDate = new Date();
const tokensToRefund = 0.8 * a * 100;
console.log(tokensToRefund);
// Check if it's the first of the month
//if (currentDate.getDate() === 1) {
  //numUsers = await countUsers();
//}

// Uncomment this line to manually trigger the token refund
refundTokens(a);

// Check if it's the last day of the month
//if (currentDate.getDate() === new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()) {
  //refundTokens(numUsers);
//}

