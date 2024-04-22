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

router.post("/:forumId/replies", isLoggedIn, async (req, res) => {
  try {
    const forumId = req.params.forumId;
    const authorId = req.session.user.id;
    const { content } = req.body;

    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ error: "Forum not found" });
    }

    const newReply = new Reply({
      forum: forumId,
      authorId,
      content,
    });

    const savedReply = await newReply.save();

    res.status(201).json(savedReply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
