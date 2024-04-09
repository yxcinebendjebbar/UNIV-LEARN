import express from "express";
import cors from "cors";
import connectToDB from "./utils/database.js";
import * as dotenv from "dotenv";
import session from "express-session";
import userRoutes from "./routes/UserRoutes.js";
import forumsRoutes from "./routes/ForumRoutes.js";
import replyRoutes from "./routes/ReplyRoutes.js";

dotenv.config();

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto", maxAge: 5 * 60 * 1000 },
  })
);

app.use("/api/users", userRoutes);
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
