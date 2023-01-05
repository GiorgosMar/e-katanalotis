const { json } = require("express");
const express = require("express");
const router = express.Router();
const pool = require("./db");
const validInfo = require("./validInfo");
const jwtGenerator = require("./jwtGenerator");
const authorize = require("./authorize");

//authorizeentication

//Register router
router.post("/register", validInfo , async (req, res) => {
  const { email, username, password, conf_password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }

    let newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password, user_conf_password) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, password, conf_password]
    );

    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({token});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Login router
router.post("/login", validInfo, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json("Λάθος στοιχεία!");
    }

    if (password !== user.rows[0].user_password){
      return res.status(401).json("Λάθος στοιχεία!");
    }

    const token = jwtGenerator(user.rows[0].user_id);
    const user_credentials = user.rows[0];

    return res.json({ token, user_credentials });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/verify", authorize, (req, res) => {
  try {
    res.json(true);
    //res.status(200).send('Empty Body');
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;