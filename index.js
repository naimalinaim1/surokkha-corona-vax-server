const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// router
app.get("/", (req, res) => {
  res.send("Surokkha server is running");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
