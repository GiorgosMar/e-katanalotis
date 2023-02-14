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

app.put("/offerProducts", async (req, res) => {
  try {
    const newOffer = await pool.query(
      "SELECT new_price, offer_id, productID, userid FROM offer ORDER BY offer_id ASC;"
    );
    
    //for every existing offer
    let i = 0;
    while (newOffer.rows[i] !== undefined) {
      //checks for criteria 5ai 
      const recentPrice = await pool.query(
        "SELECT * FROM price_history WHERE price_log_id = $1 ORDER BY date DESC LIMIT 1;",
        [newOffer.rows[i].productid]
      );

      //checks for criteria 5aii
      const averagePrice = await pool.query(
        "SELECT AVG(price) as avg_price FROM price_history WHERE price_log_id = $1;",
        [newOffer.rows[i].productid]
      );

      if (recentPrice.rows.length === 0 || averagePrice.rows.length === 0) {
        i++;
        //continue για να μην τρεξουν τα πο κατω με undefined τιμες
        continue;
      }

      //Here it checks if the new price is lower by 20% from the last day price or the average last week price
      const isGoodDealAverage =
        newOffer.rows[i].new_price < averagePrice.rows[0].avg_price * 0.8;
      const isGoodDeal =
        newOffer.rows[i].new_price < recentPrice.rows[0].price * 0.8;
      const offerId = newOffer.rows[i].offer_id;
      
      if (!isGoodDeal && !isGoodDealAverage) {
        //if none of the 5ai, 5aii criteria is true, sets valid = false only if the offer has been submitted for more than a week
        const setValid7 = await pool.query(
          "UPDATE offer SET valid = false WHERE offer_id = $1 AND entry_date < (now() - interval '7 days ');",
          [offerId]
        );
        //const set_valid = setValid.rows;
      } else {
        //if the offer has expired (2 weeks since the day it was submitted) sets valid = false
        const setValid14 = await pool.query(
          "UPDATE offer SET valid = false WHERE offer_id = $1 AND entry_date < (now() - interval '14 days ');",
          [offerId]
        );
      }
      i++;
    }
    //shows to user only the offers with valid = true
    const offerProducts = await pool.query(
      "SELECT * FROM products INNER JOIN offer ON products.product_id = offer.productID INNER JOIN store ON offer.storeID = store.id where valid = true;"
    );
    res.json(offerProducts.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//user hits the like button in an offer
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
    //
    if (existReact === undefined) {
      //if user hits the like button to like offer, score of user that submitted the offer is increased by 5
      const updateScore = await pool.query(
        "UPDATE users SET score = score + 5, score_month = score_month + 5 WHERE user_id = $1",
        [userId]
      );
    } else if (existReact.r_type === true) {
      //(true = like) if user hits like button to take back the like, score of user that submitted the offer is decreased by 5
      const updateScore = await pool.query(
        "UPDATE users SET score = score - 5, score_month = score_month - 5 WHERE user_id = $1",
        [userId]
      );
    }
    //update like number of the offer (+1 or -1)
    const likeoffer = await pool.query(
      "UPDATE offer SET likes = $1 WHERE offer_id = $2;",
      [updatedlikes, offerid]
    );
    res.json(likeoffer.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//toggles the value of stock (user changes stock)
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

//if user hits dislike button in an offer
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

//checks if a user has already reacted to an offer (when they hit the like or dislike button)
app.get("/checkReaction", async (req, res) => {
  try {
    const check_reaction = await pool.query("SELECT * FROM reaction_history");
    res.json(check_reaction.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//when user reacts to an offer, adds a record in reaction_history table
app.post("/addReaction", async (req, res) => {
  const { offerid, userid, like, date } = req.body;
  try {
    const checkreact = await pool.query(
      "SELECT * FROM reaction_history WHERE offerid=$1 AND userid=$2",
      [offerid, userid]
    );
    if (checkreact.rows.length === 0) {
      //if user has not already reacted to the offer, adds record
      const addLikedProduct = await pool.query(
        "INSERT INTO reaction_history (offerid, userid, r_type, react_date) values($1, $2, $3, $4) RETURNING *",
        [offerid, userid, like, date]
      );

      return res.status(200).json(addLikedProduct.rows);
    }
  } catch (err) {
    console.log(err.message);
  }
});

//if user takes react back, deletes the corresponding record from reaction_history
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

//GET all Stores
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
        //if search value has only name, returns all stores with that name
        res.json(storeName.rows);
      } else if (
        storeName.rows[0] === undefined &&
        storeCategory.rows[0] !== undefined
      ) {
        //if search value has only category, returns all stores of that category
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
    const { userId, newConfPassword, newPassword, password } = req.body;
    const getUserPassword = await pool.query(
      "SELECT user_password FROM users WHERE user_id = $1",
      [userId]
    );
    const userPassword = getUserPassword.rows[0];
    if (password === userPassword.user_password) {
      const updatePassword = await pool.query(
        "UPDATE users SET user_password = $1 , user_conf_password=$2 WHERE user_id = $3",
        [newPassword, newConfPassword, userId]
      );
      res.json(updatePassword.rows);
    } else {
      return res
        .status(404)
        .json({ message: "Λάθος τωρινός κωδίκος πρόσβασης" });
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
    if (password === userPassword.user_password) {
      const updateUsername = await pool.query(
        "UPDATE users SET user_name = $1  WHERE user_id = $2",
        [newUsername, userId]
      );
      res.json(updateUsername.rows);
    } else {
      return res
        .status(404)
        .json({ message: "Λάθος τωρινός κωδίκος πρόσβασης" });
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
      "SELECT * FROM subcategories WHERE parent_category_id = $1; ",
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

//admin adds new product
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

//admin deletes a product
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

//gets all the users ordered by their highest score
app.get("/userLeaderBoard", async (req, res) => {
  try {
    const leaderBoard = await pool.query(
      "SELECT users.user_name,users.score, SUM(tokens.num_tokens_entered) as total_tokens, (SELECT num_tokens_entered FROM tokens WHERE tokens.user_token = users.user_id  AND entered_date = (SELECT MAX(entered_date) FROM tokens WHERE tokens.user_token = users.user_id) limit 1) as latest_num_tokens_entered FROM users LEFT JOIN tokens ON users.user_id = tokens.user_token WHERE user_role =0 GROUP BY users.user_id, users.user_name ORDER BY users.score desc;"
    );
    res.json(leaderBoard.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//get store info for AUTOCOMPLETE
app.get("/getStoreInfo", async (req, res) => {
  try {
    const { storeid } = req.query;
    const getStore = await pool.query(
      "SELECT name, shop, ST_X(location) AS lon, ST_Y(location) AS lat FROM store WHERE id = $1;",
      [storeid]
    );
    res.json(getStore.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//admin adds store
app.post("/addStore", async (req, res) => {
  try {
    const { nameStore, shop, lat, lon } = req.body;
    const store_location = "POINT (" + lon + " " + lat + ")";
    const addStore = await pool.query(
      "INSERT INTO store (name, shop, location) values($1, $2, $3) RETURNING *",
      [nameStore, shop, store_location]
    );
    return res.json(addStore.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//admin updates store
app.put("/updateStore", async (req, res) => {
  try {
    const { storeId, newStoreName, shop, lat, lon } = req.body;
    let storeName = newStoreName;
    const store_location = "POINT (" + lon + " " + lat + ")";
    

    if (newStoreName === "") { //for the autocomplete
      const getStore = await pool.query(
        "SELECT name FROM store WHERE id = $1;",
        [storeId]
      );
      storeName = getStore.rows[0].name;
    }
    const updateStore = await pool.query(
      "UPDATE store SET name = $1, shop = $2, location = $3 WHERE id = $4;",
      [storeName, shop, store_location, storeId]
    );

    res.json(updateStore.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//admin deletes store
app.delete("/deleteStore", async (req, res) => {
  try {
    const { storeid } = req.body;
    const deleteStore = await pool.query("DELETE FROM store WHERE id = $1;", [
      storeid,
    ]);
    res.json(deleteStore.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//______________________________________charts___________________________________________

//chart1, επιστρεφει πινακα με ημερα του μηνα και αριθμο προσφορων για την καθε μερα
app.get("/numOfOffers", async (req, res) => {
  try {
    const { month, year } = req.query;
    const curr_month = year + "-" + month + "-01";
    //gets all offers from a specific month
    const offerss = await pool.query(
      "select * from offer where date_trunc('month', entry_date) = $1",
      [curr_month]
    );

    if (offerss.rows.length !== 0) {
      const countOffers = await pool.query(
        //counts number of offers for every day that at least one offer was submitted
        "select DATE_TRUNC('day', entry_date) AS date, COUNT(offer_id) AS count FROM offer where date_trunc('month', entry_date) = $1 GROUP BY DATE_TRUNC('day', entry_date) ORDER BY date ASC;",
        [curr_month]
      );

      let i = 0;
      while (i < countOffers.rows.length) {
        //converts date to number of the day (creating date object)
        const thedate = countOffers.rows[i].date;
        const dayObj = new Date(thedate);
        const dayNum = dayObj.getDate();
        countOffers.rows[i].date = dayNum;
        i++;
      }
      i = 0;
      let j = 0;
      let exists = false;
      
      //sets dayz = number of days current month has
      let dayz = 0;
      if (month == 2 && year % 4 != 0) {
        dayz = 28;
      } else if (month == 2 && year % 4 == 0 ) {
        dayz = 29;
      } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        dayz = 30;
      } else {
        dayz = 31;
      }
      while (i < dayz) {
        j = 0;
        while (j < countOffers.rows.length) {
          //for every record in countoffers, 
          const daynum = countOffers.rows[j].date;
          if (daynum === i + 1) {
            //if there is record with that day (i) = if there is at least one offer submitted that day
            j++;
            exists = true;
            break;
          } else {
            exists = false;
            j++;
          }
        }
        if (exists === false) {
          //no offers were submitted that day, so count = 0
          countOffers.rows.push({ date: i + 1, count: 0 });
        }
        i++;
      }
      const countOffer = countOffers.rows.sort((a, b) => {
        //sorting order by day ascending
        if (a.date < b.date) {
          return -1;
        }
      });
      let countOfferr = [];
      for (i = 0; i < countOffer.length; i++) {
        //takes the count for every day (typecasted) and puts it in an array (sorted, so day number not needed)
        let offerNum = Number(countOffers.rows[i].count);
        countOfferr.push(offerNum);
      }
      res.json(countOfferr);
    } else {
      res.status(400).json({ message: "no offers in this month" });
    }
  } catch (err) {
    console.log(err.message);
  }
});

//chart2
//This gets the average percentage of discount for a certain day if only category is defined
app.get("/getProductOffersFromCategories", async (req, res) => {
  try {
    const { categoryId, month, year, page } = req.query;
    const limit = 7;

    const startIndex = (page - 1) * limit + 1;
    const endIndex = page * limit;
    let priceInfo;
    if (page < 5) {
      priceInfo = await pool.query(
        "SELECT AVG(price) as avg_price , price_log_id, o.new_price  FROM price_history join products p on price_history.price_log_id =p.product_id join offer o on o.productid = p.product_id  WHERE p.category =$1  and o.entry_date BETWEEN date ($4 || '-' || $5 || '-' || $2) AND date ($4 || '-' || $5 || '-' || $3) group by price_history.price_log_id, o.new_price;",
        [categoryId, startIndex, endIndex, year, month]
      );
    } else if (page === 5) {
      if (
        month === 1 ||
        month === 3 ||
        month === 5 ||
        month === 7 ||
        month === 8 ||
        month === 10 ||
        month === 12
      ) {
        endIndex = startIndex + 2;
        priceInfo = await pool.query(
          "SELECT AVG(price) as avg_price , price_log_id, o.new_price  FROM price_history join products p on price_history.price_log_id =p.product_id join offer o on o.productid = p.product_id  WHERE p.category =$1  and o.entry_date BETWEEN date ($4 || '-' || $5 || '-' || $2) AND date ($4 || '-' || $5 || '-' || $3) group by price_history.price_log_id, o.new_price;",
          [categoryId, startIndex, endIndex, year, month]
        );
      } else if (month === 2 && year % 4 === 0) {
        endIndex = startIndex;
        priceInfo = await pool.query(
          "SELECT AVG(price) as avg_price , price_log_id, o.new_price  FROM price_history join products p on price_history.price_log_id =p.product_id join offer o on o.productid = p.product_id  WHERE p.category =$1  and o.entry_date BETWEEN date ($4 || '-' || $5 || '-' || $2) AND date ($4 || '-' || $5 || '-' || $3) group by price_history.price_log_id, o.new_price;",
          [categoryId, startIndex, endIndex, year, month]
        );
      } else {
        endIndex = startIndex + 1;
        priceInfo = await pool.query(
          "SELECT AVG(price) as avg_price , price_log_id, o.new_price  FROM price_history join products p on price_history.price_log_id =p.product_id join offer o on o.productid = p.product_id  WHERE p.category =$1  and o.entry_date BETWEEN date ($4 || '-' || $5 || '-' || $2) AND date ($4 || '-' || $5 || '-' || $3) group by price_history.price_log_id, o.new_price;",
          [categoryId, startIndex, endIndex, year, month]
        );
      }
    }

    let avgDiscount = 0;
    let roundAvgs = [];

    while (startIndex <= endIndex) {
      let i = 0;
      let sumDiscount = 0;
      while (i < priceInfo.rows.length) {
        if (
          priceInfo.rows.entry_date ===
          year + "-" + month + "-" + startIndex
        ) {
          sumDiscount +=
            ((priceInfo.rows[i].avg_price - priceInfo.rows[i].new_price) /
              priceInfo.rows[i].avg_price) *
            100;
        }
        i++;
      }
      avgDiscount = sumDiscount / priceInfo.rows.length;
      let roundAvg = Math.round(avgDiscount);
      roundAvgs.push(roundAvg);
      startIndex++;
    }

    if (priceInfo.rows.length === 0) {
      return res.status(400).json({ message: "no offers in this month" });
    } else if (
      month === 1 ||
      month === 3 ||
      month === 5 ||
      month === 7 ||
      month === 8 ||
      month === 10 ||
      month === 12
    ) {
      const data = {
        dataforchart: roundAvgs,
        countPages: 31 / limit,
        pageNumber: page / 1,
      };
      return res.json(data);
    } else if (month === 2 && year % 4 !== 0) {
      const data = {
        dataforchart: roundAvgs,
        countPages: 28 / limit,
        pageNumber: page / 1,
      };
      return res.json(data);
    } else if (month === 2 && year % 4 === 0) {
      const data = {
        dataforchart: roundAvgs,
        countPages: 29 / limit,
        pageNumber: page / 1,
      };
      return res.json(data);
    } else {
      const data = {
        dataforchart: roundAvgs,
        countPages: 30 / limit,
        pageNumber: page / 1,
      };
      return res.json(data);
    }
  } catch (error) {
    console.log(error.message);
  }
});

//delete offer (sets valid=false)
app.put("/deleteOffer", async (req, res) => {
  try {
    const { offerid } = req.body;
    const updateStore = await pool.query(
      "UPDATE offer SET valid = false WHERE offer_id = $1;",
      [offerid]
    );
    res.json(updateStore.rows);
  } catch (err) {
    console.log(err.message);
  }
});

async function countUsers() {
  // Get number of users
  const query = "SELECT COUNT(*) as count FROM users;";
  const res = await pool.query(query);
  const numUsers = +res.rows[0].count;

  return numUsers;
}

async function refundTokens(tokensToRefund, numUsers) {
  if (numUsers !== 0 && !isNaN(tokensToRefund)) {
    // Calculate amount of tokens to give to each user
    const tokensPerUser = Math.round(tokensToRefund / numUsers);
    console.log(tokensPerUser);
    try {
      // Insert the token entries for all users
      const userId = await pool.query("SELECT user_id FROM users;");
      let i = 0;
      while (userId.rows[i] !== undefined) {
        await pool.query(
          "INSERT INTO tokens (user_token,num_tokens_entered,entered_date) VALUES ($1,$2,now());",
          [userId.rows[i].user_id, tokensPerUser]
        );
        console.log("Inserted for user no " + i);
        i++;
      }
    } catch (err) {
      console.log(err.message);
    }
  }
}

let counterFirst = 0;
let counterSecond = 1;
//1 of month
async function first() {
  const numUsers = await countUsers();
  const tokensToRefund = 80 * numUsers;
  console.log("first");
  await pool.query("INSERT INTO tokens_to_refund(num_tokens) VALUES ($1);", [
    tokensToRefund,
  ]);
  counterFirst++;
}

//end of month
async function second() {
  const newNumUsers = await countUsers();
  const tokensToSplit = await pool.query(
    "SELECT num_tokens from tokens_to_refund ORDER BY id DESC LIMIT 1;"
  );
  console.log(tokensToSplit.rows[0].num_tokens);
  refundTokens(tokensToSplit.rows[0].num_tokens, newNumUsers);
  await pool.query("DELETE FROM tokens_to_refund;");
  counterSecond++;
}

// async function theLoop() {
//   let currentDate = new Date();

//   if (currentDate.getSeconds() === 1) {
//     await pool.query("UPDATE users SET score_month = 0;");
//     console.log("first function");
//     first();
//   }
//   if (currentDate.getSeconds() === 30) {
//     if (counterFirst === counterSecond) {
//       console.log("second function");
//       second();
//     }
//   }
// }

// setInterval(theLoop, 1000);

async function theLoop() {
  let currentDate = new Date();
  //let currentDate = new Date(2023, 1, 15); //for exams

  //if it is first day of the month
    if(currentDate.getDate() === 1){
      await pool.query("UPDATE users SET score_month = 0;");
      console.log("first function");
      first();
    }
    //if it is last day of the month
    if(currentDate.getDate() === new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()){
      if(counterFirst === counterSecond){
        console.log("second function");
        second();
      }
    }
}

//checks once a day
setInterval(theLoop, 8640000);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
