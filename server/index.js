const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { emptyQuery } = require("pg-protocol/dist/messages");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//ROUTES

//GET ALL
app.get("/store", async (req, res) => {
  try {
    const { search_value } = req.query;

    if (search_value !== undefined) {
      const storeName = await pool.query(
        "SELECT * FROM store WHERE store_name=$1",
        [search_value]
      );
      const storeCategory = await pool.query(
        "SELECT * FROM store WHERE store_description=$1",
        [search_value]
      );

      if (storeName.rows[0] === undefined && storeCategory.rows[0] !== undefined ) {
        res.json(storeCategory.rows);
      } else if (storeName.rows[0] !== undefined && storeCategory.rows[0] === undefined) {
        res.json(storeName.rows);
      }else{
        res.json("Not found");
      }
    } else {
      const allStores = await pool.query("SELECT * FROM store");
      res.json(allStores.rows);
    }
  } catch (err) {
    console.log(err.message);
  }
});

//REGISTER & LOGIN
app.use("/auth", require("./jwtAuth"));

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
