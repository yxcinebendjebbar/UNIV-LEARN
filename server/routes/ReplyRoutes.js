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
