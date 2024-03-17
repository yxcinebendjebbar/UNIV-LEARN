import express from "express";
import cors from "cors";
import connectToDB from "./utils/database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToDB(process.env.MONGODBURI);
});
