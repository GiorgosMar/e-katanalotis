const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { emptyQuery } = require("pg-protocol/dist/messages");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//ROUTES

app.get("/productsForSubmitOffer", async (req, res) => {
  try {
    const Products = await pool.query("SELECT * FROM products;");
    res.json(Products.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/addOffer", async (req, res) => {
  const { product_id, store_id, initialPrice, newPrice, userId, date } =
    req.body;
  try {
    const selOffer = await pool.query(
      "SELECT * FROM offer WHERE productid = $1 AND storeid = $2 ORDER BY offer_id DESC",
      [product_id, store_id]
    );

    if (
      selOffer.rows.length === 0 ||
      newPrice <= 0.8 * selOffer.rows[0].new_price
    ) {
      const addOffer = await pool.query(
        "INSERT INTO offer(productid, storeid, init_price, new_price, userid, entry_date) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        [product_id, store_id, initialPrice, newPrice, userId, date]
      );
      res.json(addOffer.rows);
    } else {
      res.json("Bad offer");
    }
  } catch (err) {
    console.log(err.message);
  }
});

app.put("/updateUserScoreOnNewOffer", async (req, res) => {
  try {
    const newOffer = await pool.query(
      "SELECT new_price, productID, userid FROM offer ORDER BY offer_id DESC LIMIT 1;"
    );

    //This is for the 50 points
    const recentPrice = await pool.query(
      "SELECT * FROM price_history WHERE price_log_id = $1 ORDER BY date DESC LIMIT 1;",
      [newOffer.rows[0].productid]
    );
    if (recentPrice.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no recent price for the product" });
    }

    //This is for the 20 points
    const averagePrice = await pool.query(
      "SELECT AVG(price) as avg_price FROM price_history WHERE price_log_id = $1;",
      [newOffer.rows[0].productid]
    );
    if (averagePrice.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no average price for the product" });
    }

    //Here it checks if the new price is lower by 20% from the last day price or the average last week price
    const isGoodDealAverage =
      newOffer.rows[0].new_price < averagePrice.rows[0].avg_price * 0.8;

    const isGoodDeal =
      newOffer.rows[0].new_price < recentPrice.rows[0].price * 0.8;

    const userId = newOffer.rows[0].userid;

    //Now we check how many points we must give
    let score = 0;
    if (isGoodDeal) {
      score += 50;
    }
    if (isGoodDealAverage) {
      score += 20;
    }
    await pool.query("UPDATE users SET score = score + $1 WHERE user_id = $2", [
      score,
      userId,
    ]);
    res.status(200).json({ isGoodDeal, isGoodDealAverage });
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/offerProducts", async (req, res) => {
  try {
    const offerProducts = await pool.query(
      "SELECT * FROM products INNER JOIN offer ON products.product_id = offer.productID INNER JOIN store ON offer.storeID = store.id;"
    );
    res.json(offerProducts.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.put("/offerlike", async (req, res) => {
  try {
    const { updatedlikes } = req.query;
    const { offerid } = req.query;
    const userid = await pool.query(
      "SELECT userid from offer WHERE offer_id = $1",
      [offerid]
    );
    const userId = userid.rows[0].userid;
    const existReaction = await pool.query(
      "SELECT r_type FROM reaction_history WHERE offerid = $1 AND userid = $2",
      [offerid, userId]
    );
    const existReact = existReaction.rows[0];
    if (existReact === undefined) {
      const updateScore = await pool.query(
        "UPDATE users SET score = score + 5, score_month = score_month + 5 WHERE user_id = $1",
        [userId]
      );
    } else if (existReact.r_type === true) {
      const updateScore = await pool.query(
        "UPDATE users SET score = score - 5, score_month = score_month - 5 WHERE user_id = $1",
        [userId]
      );
    }
    const likeoffer = await pool.query(
      "UPDATE offer SET likes = $1 WHERE offer_id = $2;",
      [updatedlikes, offerid]
    );
    res.json(likeoffer.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.put("/updateStock", async (req, res) => {
  try {
    const { offerid } = req.body;
    const updateStock = await pool.query(
      "UPDATE offer SET stock = NOT stock WHERE offer_id = $1;",
      [offerid]
    );
    res.json(updateStock.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.put("/offerdislike", async (req, res) => {
  try {
    const { updateddislikes } = req.query;
    const { offerid } = req.query;
    const userid = await pool.query(
      "SELECT userid from offer WHERE offer_id = $1",
      [offerid]
    );
    const userId = userid.rows[0].userid;

    const existReaction = await pool.query(
      "SELECT r_type FROM reaction_history WHERE offerid = $1 AND userid = $2",
      [offerid, userId]
    );

    const existReact = existReaction.rows[0];

    if (existReact === undefined) {
      const updateScore = await pool.query(
        "UPDATE users SET score = score - 1, score_month = score_month - 1 WHERE user_id = $1",
        [userId]
      );
    } else if (existReact.r_type === false) {
      const updateScore = await pool.query(
        "UPDATE users SET score = score + 1, score_month = score_month + 1 WHERE user_id = $1",
        [userId]
      );
    }
    const likeoffer = await pool.query(
      "UPDATE offer SET dislikes = $1 WHERE offer_id = $2;",
      [updateddislikes, offerid]
    );
    res.json(likeoffer.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/checkReaction", async (req, res) => {
  try {
    const check_reaction = await pool.query("SELECT * FROM reaction_history");
    res.json(check_reaction.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/addReaction", async (req, res) => {
  const { offerid, userid, like } = req.body;
  try {
    const checkreact = await pool.query(
      "SELECT * FROM reaction_history WHERE offerid=$1 AND userid=$2",
      [offerid, userid]
    );
    if (checkreact.rows.length === 0) {
      const addLikedProduct = await pool.query(
        "INSERT INTO reaction_history (offerid, userid, r_type) values($1, $2, $3) RETURNING *",
        [offerid, userid, like]
      );

      return res.status(200).json(addLikedProduct.rows);
    }
  } catch (err) {
    console.log(err.message);
  }
});

app.delete("/deleteLikedProduct", async (req, res) => {
  try {
    const { offerid, userid } = req.query;
    const deleteElement = await pool.query(
      "DELETE FROM reaction_history WHERE offerid=$1 AND userid=$2",
      [offerid, userid]
    );
    res.json(deleteElement.rows[0]);
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

//REGISTER & LOGIN
app.use("/auth", require("./jwtAuth"));

//Για το ερωτημα 6
//This gets the new Credentials for the user
app.get("/updatedUserCreds", async (req, res) => {
  try {
    const { userId } = req.query;
    const userCreds = await pool.query(
      "SELECT * FROM users WHERE user_id = $1;",
      [userId]
    );
    res.json(userCreds.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//Here we update the user's password
app.put("/updateUserPassword", async (req, res) => {
  try {
    const { userId,newConfPassword, newPassword, password } = req.body;
    const getUserPassword = await pool.query(
      "SELECT user_password FROM users WHERE user_id = $1",
      [userId]
    );
    const userPassword = getUserPassword.rows[0];
    if(password === userPassword.user_password){
    const updatePassword = await pool.query(
      "UPDATE users SET user_password = $1 , user_conf_password=$2 WHERE user_id = $3",
      [newPassword,newConfPassword, userId]
    );
    res.json(updatePassword.rows);
    }else{
      return res.status(404).json({ message: "Λάθος τωρινός κωδίκος πρόσβασης" })
    }
  } catch (error) {
    console.log(err.message);
  }
});

//Here we update the user's username
app.put("/updateUsername", async (req, res) => {
  try {
    const { userId, newUsername, password } = req.body;
    const getUserPassword = await pool.query(
      "SELECT user_password FROM users WHERE user_id = $1",
      [userId]
    );
    const userPassword = getUserPassword.rows[0];
    if(password === userPassword.user_password){
      const updateUsername = await pool.query(
        "UPDATE users SET user_name = $1  WHERE user_id = $2",
        [newUsername, userId]
      );
      res.json(updateUsername.rows);
    }else{
      return res.status(404).json({ message: "Λάθος τωρινός κωδίκος πρόσβασης" })
    }
  } catch (error) {
    console.log(err.message);
  }
});

app.get("/showStats", async (req, res) => {
  try {
    const { userid } = req.query;
    
    //This gets the reactions that a user has done: The reaction date, the reaction type, the product name and the name of the store
    const allReactions = await pool.query(
      "SELECT rh.react_date, rh.r_type, st.name, pr.product_name FROM reaction_history rh JOIN offer o ON rh.offerid = o.offer_id JOIN store st ON o.storeID = st.id JOIN products pr ON o.productID = pr.product_id WHERE rh.userid = $1;",
      [userid]
    );
    
    //This gets the last entry of tokens for the user and also the total of tokens he has collected
    const userTokens = await pool.query(
      "SELECT num_tokens_entered, SUM(num_tokens_entered) OVER (PARTITION BY user_token) as total_tokens FROM tokens WHERE user_token = $1 ORDER BY entered_date DESC LIMIT 1;",
      [userid]
    );
    
    //This gets the total score of the user and also the score that he has collected this month
    const userScore = await pool.query(
      "SELECT score,score_month FROM users WHERE user_id = $1",
      [userid]
    );
    
    //This gets for the logged user his submitted offers. The product name , the store ,the entry date and also likes and dislikes
    const offersSubmitted = await pool.query(
      "SELECT offer.entry_date, offer.likes, offer.dislikes, store.name, products.product_name FROM offer JOIN store ON offer.storeID = store.id JOIN products ON offer.productID = products.product_id WHERE offer.userid = $1;",
      [userid]
    );
    
    //Here we pass into const the rows of the above queries 
    const reactions = allReactions.rows;
    const tokens = userTokens.rows;
    const score = userScore.rows;
    const offers = offersSubmitted.rows;
    
    //And return all in one JSON
    res.json({ reactions, tokens, score, offers });
  } catch (err) {
    console.log(err.message);
  }
});


//-----------------------------------ADMIN-----------------------------------------//
app.get("/getCategories", async (req, res) => {
  try {
    const allCategories = await pool.query("SELECT * FROM categories;");
    res.json(allCategories.rows);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/getSubcategories", async (req, res) => {
  try {
    const { parentCategory } = req.query;
    const subgategories = await pool.query(
      "SELECT * FROM subcategories WHERE parent_category = $1; ",
      [parentCategory]
    );
    res.json(subgategories.rows);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/getProductsFromSubcategory", async (req, res) => {
  try {
    const { parentSubcategory } = req.query;
    const products = await pool.query(
      "SELECT * FROM products WHERE subcategory = $1 ",
      [parentSubcategory]
    );
    res.json(products.rows);
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/insertProduct", async (req, res) => {
  try {
    const { productName, category, subcategory } = req.body;
    await pool.query(
      "INSERT INTO products (product_name,category,subcategory) VALUES ($1,$2,$3);",
      [productName, category, subcategory]
    );
    res.status(200).json({ message: "Product Inserted" });
  } catch (error) {
    console.log(error.message);
  }
});

app.delete("/deleteProduct", async (req, res) => {
  try {
    const { productId } = req.query;
    const deleteProduct = await pool.query(
      "DELETE FROM products WHERE product_id = $1;",
      [productId]
    );
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log(error.message);
  }
});


//This gets all the users ordered by their highest score
app.get("/userLeaderBoard", async (req, res) => {
  try {
    const leaderBoard = await pool.query(
      "SELECT users.user_name,users.score, SUM(tokens.num_tokens_entered) as total_tokens, (SELECT num_tokens_entered FROM tokens WHERE tokens.user_token = users.user_id AND entered_date = (SELECT MAX(entered_date) FROM tokens WHERE tokens.user_token = users.user_id)) as latest_num_tokens_entered FROM users LEFT JOIN tokens ON users.user_id = tokens.user_token GROUP BY users.user_id, users.user_name ORDER BY users.score desc;"
    );
    res.json(leaderBoard.rows);
  } catch (err) {
    console.log(err.message);
  }
});


//get store info for AUTOCOMPLETE
app.get("/getStoreInfo",  async (req, res) => {
try {
  const {storeId} = req.query;
  const getStore = await pool.query(
    "SELECT name, shop, ST_X(location) AS lon, ST_Y(location) AS lat FROM store WHERE id = $1;",
    [storeId]
  );
  res.json(getStore.rows);

  } catch (err) {
    console.log(err.message);
  }

});

//add store
app.post("/addStore", async (req, res) => {
  try {
    const { nameStore, shop, lat, lon } = req.body;
    const store_location = "POINT ("+lat+" "+lon+")";
    const addStore = await pool.query(
      "INSERT INTO store (name, shop, location) values($1, $2, $3) RETURNING *",
      [nameStore, shop, store_location]
    );
    return res.json(addStore.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//update store
app.put("/updateStore", async (req, res) => {
  try {
    const { storeId, newStoreName, shop, lat, lon } = req.body;
    const store_location = "POINT ("+lat+" "+lon+")";
    const updateStore = await pool.query(
      "UPDATE store SET name = $1, shop = $2, location = $3 WHERE id = $4;",
      [newStoreName, shop, store_location, storeId]
    );

    res.json(updateStore.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//delete offer (sets valid=false)
app.put("/deleteOffer", async (req, res) => {
  try {
    const { offer_id } = req.body;
    const updateStore = await pool.query(
      "UPDATE offer SET valid = false WHERE offer_id = $1;",
      [offer_id]
    );
    res.json(updateStore.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//delete store
app.delete("/deleteStore", async (req, res) => {
  try {
    const { store_id } = req.body;
    const deleteStore = await pool.query(
      "DELETE FROM store WHERE id = $1;", 
      [store_id]
    );
    res.json(deleteStore.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//charts
//chart1
app.get("/numOfOffers", async (req, res) => {
  try {
    const { offerDate } = req.query;
    console.log(offerDate);
    const countOffers = await pool.query(
      "SELECT COUNT(*) FROM offer WHERE entry_date = $1;",
      [offerDate]
    );
    
    res.json(countOffers.rows[0].count);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

