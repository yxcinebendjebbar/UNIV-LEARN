import express from "express";
import Forum from "../models/ForumModel.js";
import Reply from "../models/ReplyModel.js";

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  next();
};

const isProfessor = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "teacher") {
    return res
      .status(403)
      .json({ error: "Only professors can perform this action" });
  }
  next();
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
