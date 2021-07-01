const express = require("express");
const router = express.Router();
const comments = require("./comment.json");
const fs = require("fs");

router.get("/", (req, res) => {
  if (comments[0].id < comments[1].id) {
    res.send(comments.reverse());
    comments.reverse();
  }
  res.send(comments);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((item) => {
    return item.id == id;
  });
  if (!comment) res.sendStatus(500);
  res.send(comment);
});

router.post("/", (req, res) => {
  const { userId, postId, content } = req.body;
  const time = new Date().getTime();
  comments.push({
    id: comments[comments.length - 1].id + 1,
    userId,
    postId,
    content,
    time,
  });
  fs.writeFile(
    "./src/routers/comment/comment.json",
    JSON.stringify(comments),
    function (err) {
      if (err) res.sendStatus(500);
      else res.send({ status: "success" });
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const idComment = comments.findIndex((item) => {
    return item.id == id;
  });
  if (idComment == -1) res.sendStatus(500);
  else {
    comments[idComment].content = content;
    fs.writeFile(
      "./src/routers/comment/comment.json",
      JSON.stringify(comments),
      function (err) {
        if (err) res.sendStatus(500);
        else res.send({ status: "success" });
      }
    );
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const idComment = comments.findIndex((item) => {
    return item.id == id;
  });
  if (idComment == -1) res.sendStatus(500);
  else {
    comments.splice(idComment, 1);
    fs.writeFile(
      "./src/routers/comment/comment.json",
      JSON.stringify(comments),
      function (err) {
        if (err) res.sendStatus(500);
        else res.send({ status: "success" });
      }
    );
  }
});

router.get("/post/:id", (req, res) => {
  const { id } = req.params;
  const posts = comments.filter((item) => {
    return item.postId == id;
  });
  res.send(posts);
});

router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  const users = comments.filter((item) => {
    return item.userId == id;
  });
  res.send(users);
});

module.exports = router;
