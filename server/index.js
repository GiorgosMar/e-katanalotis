const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//ROUTES


//REGISTER & LOGIN
app.use("/auth", require("./jwtAuth"));


app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });