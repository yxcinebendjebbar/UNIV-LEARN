import express from "express";
import cors from "cors";
import connectToDB from "./utils/database.js";
import dotenv from "dotenv";
import session from "express-session";
import studentRoutes from "./routes/StudentRoutes.js";
import profsRoutes from "./routes/ProfRoutes.js";

dotenv.config();

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto", maxAge: 3000 },
  })
);

app.use(
  "/students",
  (req, res, next) => {
    console.log(req.session);
    next();
  },
  studentRoutes
);
app.use("/profs", profsRoutes);

// const requireAuth = (req, res, next) => {
//   if (req.session.userId) {
//     next(); // User is authenticated, continue to next middleware
//   } else {
//     res.redirect("/login"); // User is not authenticated, redirect to login page
//   }
// };

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToDB(process.env.MONGODBURI);
});
