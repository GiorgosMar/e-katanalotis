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


// Here the users score is updated when he uploads an offer based on if the user has a good deal or it is a good deal for the average week price
app.put("/updateUserScoreOnNewOffer", async (req, res) => {
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
    if (averagePrice.rows.length === 0) {
      return res.status(404).json({ message: "There is no average price for the product" });
    }
    

    //Here it checks if the new price is lower by 20% from the last day price or the average last week price 
    const isGoodDealAverage = newOffer.rows[0].new_price < averagePrice.rows[0].avg_price * 0.8;

    const isGoodDeal = newOffer.rows[0].new_price < recentPrice.rows[0].price * 0.8;

    const userId = newOffer.rows[0].userid;

    //Now we check how many points we must give 
    let score = 0;
    if (isGoodDeal) {
      score += 50;
    }
    if (isGoodDealAverage) {
      score += 20;
    }
    await pool.query("UPDATE users SET score = score + $1 WHERE user_id = $2", [score, userId]);
    res.status(200).json({ message: "Score updated successfully" });
  }catch(err){
    console.log(err.message);
  }

});
//ελεγχει το ριακτ χιστορι και κανει ινσερτ το ριακσιον αν πρεπει
app.post("/addReaction",  async (req, res) => {
  const { offerId, userId }= req.body; 
  try {
    const checkreact = await pool.query(
      "SELECT * FROM reaction_history WHERE offerid=$1 AND userid=$2",
      [offerId, userId]
    );
    if (checkreact.rows.length === 0) {
      const addLikedProduct = await pool.query("INSERT INTO reaction_history (offerid, userid) values($1, $2) RETURNING *",
      [offerId, userId]);

      return res.status(404).json(addLikedProduct.rows);
    }
  } catch (err) {
    console.log(err.message);
  }
});

//get all reaction history
app.get("/checkReaction", async (req, res) => {
  try {
    const check_reaction = await pool.query(
      "SELECT * FROM reaction_history"
    );
    res.json(check_reaction.rows);
  } catch (err) {
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

app.post("/addOffer",  async (req, res) => {
  const { product_id, store_id, initialPrice, newPrice, userId }= req.body; 
  try {
    const addOffer = await pool.query(
      "INSERT INTO offer(productid, storeid, init_price, new_price, userid) VALUES($1, $2, $3, $4, $5)",
      [product_id, store_id, initialPrice, newPrice, userId]
    );
    res.json(addOffer.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.delete("/deleteOffer",  async (req, res) => {
  const { offerId }= req.body; 
  try {
    const deleteOffer = await pool.query(
      "DELETE FROM offer WHERE offer_id = $1",
      [offerId]
    );
    res.json(deleteOffer.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//REGISTER & LOGIN
app.use("/auth", require("./jwtAuth"));

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
