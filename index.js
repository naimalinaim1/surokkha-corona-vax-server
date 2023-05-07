import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 88;

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
