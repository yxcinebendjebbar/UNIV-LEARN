import express from "express";
import cors from "cors";
import connectToDB from "./utils/database.js";
import * as dotenv from "dotenv";
import session from "express-session";
import studentRoutes from "./routes/StudentRoutes.js";
import profsRoutes from "./routes/ProfRoutes.js";
import forumsRoutes from "./routes/ForumRoutes.js";
import replyRoutes from "./routes/ReplyRoutes.js";

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
    cookie: { secure: "auto", maxAge: 5*60*1000 },
  })
);

app.use(
  "/api/students",
  (req, res, next) => {
    console.log(req.session);
    next();
  },
  studentRoutes
);
app.use("/api/profs", profsRoutes);
app.use("/api/forums", forumsRoutes);
app.use("/api/reply", replyRoutes);

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
