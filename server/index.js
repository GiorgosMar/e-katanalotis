const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { emptyQuery } = require("pg-protocol/dist/messages");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//ROUTES

app.get("/products", async (req, res) => {
  try {
    const offerProducts = await pool.query(
      "SELECT * FROM products INNER JOIN offer ON products.product_id = offer.productID INNER JOIN store ON offer.storeID = store.id;"
    );
    res.json(offerProducts.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//GET ALL Stores
app.get("/store", async (req, res) => {
  try {
    const { search_value } = req.query;

    if (search_value !== undefined) {
      const storeName = await pool.query(
        "SELECT *, ST_X(location) AS longitude, ST_Y(location) AS latitude FROM store LEFT JOIN offer ON store.id = offer.storeID WHERE name=$1;",
        [search_value]
      );
      const storeCategory = await pool.query(
        "SELECT *, ST_X(location) AS longitude, ST_Y(location) AS latitude from categories inner join products on categories.category_id=products.category inner join offer on products.product_id=offer.productid INNER JOIN store ON offer.storeID = store.id WHERE category_name=$1",
        [search_value]
      );

      if (
        storeName.rows[0] !== undefined &&
        storeCategory.rows[0] === undefined
      ) {
        res.json(storeName.rows);
      } else if (
        storeName.rows[0] === undefined &&
        storeCategory.rows[0] !== undefined
      ) {
        res.json(storeCategory.rows);
      } else {
        res.json("Not found");
      }
    } else {
      const allStores = await pool.query(
        "SELECT *, ST_X(location) AS longitude, ST_Y(location) AS latitude FROM store LEFT JOIN offer ON store.id = offer.storeID;"
      );
      res.json(allStores.rows);
    }
  } catch (err) {
    console.log(err.message);
  }
});


//This gets the new price, productID and userid from the latest offer and checks if the new offer is a deal to give 50 points to or 20 
app.get("/newOfferClues", async (req, res) => {
  try{
    const newOffer = await pool.query(
      "SELECT new_price, productID, userid FROM offer ORDER BY offer_id DESC LIMIT 1;" 
    );
    if (newOffer.rows.length === 0) {
      return res.status(404).json({ message: "There is no latest offer" });
    }

    //This is for the 50 points 
   const recentPrice = await pool.query(
      "SELECT * FROM price_history WHERE price_log_id = $1 ORDER BY date DESC LIMIT 1;",
      [newOffer.rows[0].productid]
    );
     if (recentPrice.rows.length === 0) {
       return res.status(404).json({ message: "There is no recent price for the product" });
     }

     //This is for the 20 points
   const averagePrice = await pool.query(
     "SELECT AVG(price) as avg_price FROM price_history WHERE price_log_id = $1;",
     [newOffer.rows[0].productid]
    );
   // console.log(averagePrice);
    if (averagePrice.rows.length === 0) {
      return res.status(404).json({ message: "There is no average price for the product" });
    }
    
    //Here it checks if the new price is lower by 20% from the last day price or the average last week price 
    const isGoodDealAverage = newOffer.rows[0].new_price < averagePrice.rows[0].avg_price * 0.8;
    
    const isGoodDeal = newOffer.rows[0].new_price < recentPrice.rows[0].price * 0.8;

    const userId = newOffer.rows[0].userid;

    res.status(200).json({ isGoodDeal: isGoodDeal, isGoodDealAverage: isGoodDealAverage ,userId: userId });
  
  }catch(err){
    console.log(err.message);
  }

});
app.put("/offerlike", async (req, res) => {
  try {
    const { updatedlikes } = req.query;
    const { offerid } = req.query;
    const likeoffer = await pool.query(
      "UPDATE offer SET likes = $1 WHERE offer_id = $2;",
      [updatedlikes, offerid]
    );
     res.json(likeoffer.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.put("/offerdislike", async (req, res) => {
  try {
    const { updateddislikes } = req.query;
    const { offerid } = req.query;
    const dislikeoffer = await pool.query(
      "UPDATE offer SET dislikes = $1 WHERE offer_id = $2;",
      [updateddislikes, offerid]
    );
    res.json(dislikeoffer.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.put("/offerscore", async (req, res) => {
  try {
    //const { score } = req.query;
    const { userid } = req.query;
    const updatescore = await pool.query(
      "UPDATE users SET score = score + 1 WHERE user_id = $1;",
      [userid]
    );
    res.json(updatescore.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//REGISTER & LOGIN
app.use("/auth", require("./jwtAuth"));

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
