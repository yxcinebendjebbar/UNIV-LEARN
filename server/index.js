import express from "express";
import cors from "cors";
import connectToDB from "./utils/database.js";
import dotenv from "dotenv";
import studentRoutes from "./routes/StudentRoutes.js";
import profsRoutes from "./routes/ProfRoutes.js";

dotenv.config();

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use("/students", studentRoutes);
app.use("/profs", profsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToDB(process.env.MONGODBURI);
});
