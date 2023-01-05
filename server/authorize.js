const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const Token = req.header("token");

  if (!Token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  try {
    //it is going to give use the user id (user:{id: user.id})
    const verify = jwt.verify(Token, process.env.jwtSecret);

    req.user = verify.user;

    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};