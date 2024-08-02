import express from "express";
import Forum from "../models/ForumModel.js";
import Reply from "../models/ReplyModel.js";

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const bearer = req.headers.authorization.split(" ");
    token = bearer[1];

    req.token = token;
    next();
  } else {
    //If header is undefined return Forbidden (403)
    res.sendStatus(403);
  }
};
const isProfessor = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const bearer = req.headers.authorization.split(" ");
    token = bearer[1];

    req.token = token;
    const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY);
    if (decoded.user.role === "professor") {
      next();
    }
  } else {
    //If header is undefined return Forbidden (403)
    res.sendStatus(403);
  }
};

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const forums = await Forum.find().populate("createdBy", "username");
    res.status(200).json(forums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    const forumId = req.params.id;

    const forum = await Forum.findById(forumId).populate({
      path: "createdBy",
      select: "username fullName",
    });

    if (!forum) {
      return res.status(404).json({ message: "Forum not found" });
    }

    const replies = await Reply.find({ forum: forumId }).populate({
      path: "authorId",
      select: "username fullName",
    });

    res.json({ forum, replies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create", isLoggedIn, isProfessor, async (req, res) => {
  try {
    const newForum = new Forum({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.session.user.id,
    });
    const savedForum = await newForum.save();
    res.status(201).json(savedForum);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
