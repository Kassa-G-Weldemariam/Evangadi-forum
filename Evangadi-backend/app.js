require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
//database connection
const dbConnection = require("./db/dbConfig");
//user route middleware file
const userRoute = require("./routes/userRoute");
//question route file
const questionRoute = require("./routes/questionRoute");
//authentication middleware file
const { authMiddleware } = require("./middleware/authMiddleware");

//json middleware to extract json
app.use(express.json());

//user route middleware
app.use("/api/users", userRoute);
//question route middleware
app.use("/api/questions", authMiddleware, questionRoute);

async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");
    await app.listen(port);
    console.log("database connection established");
    console.log(`listening on ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}

start();
