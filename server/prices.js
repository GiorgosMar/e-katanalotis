const Pool = require("pg").Pool;
const fs = require("fs");


const pool = new Pool({
  user: "postgres",
  password: "1111",
  host: "localhost",
  port: 5432,
  database: "webprojectdb"
});

const jsonData= JSON.parse(fs.readFileSync("C:/Users/marma/OneDrive/Υπολογιστής/prices.json"));


const insertPriceHistory = async (jsonData) => {
  try {
    for (let i = 0; i < jsonData.data.length; i++) {
      const productId = jsonData.data[i].id;
      for (let j = 0; j < jsonData.data[i].prices.length; j++) {
        const date = jsonData.data[i].prices[j].date;
        const price = jsonData.data[i].prices[j].price;
        const query = `INSERT INTO price_history (price_log_id, date, price) VALUES (${productId}, '${date}', ${price})`;
        await pool.query(query);
      }
    }
    console.log('Price history inserted successfully');
  } catch (err) {
    console.error(err);
  }
};

insertPriceHistory(jsonData);
  


module.exports = pool;