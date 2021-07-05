const express = require("express");
const router = express.Router();
const comments = require("./comment.json");
const fs = require("fs");

router.get("/", (req, res) => {
  const commentsReverse = [...comments];
  commentsReverse.reverse();
  res.send({ status: "success", data: commentsReverse });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((item) => {
    return item.id == id;
  });
  if (!comment) res.sendStatus(500);
  res.send({ status: "success", data: comment });
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
  const postComments = comments.filter((item) => {
    return item.postId == id;
  });
  res.send({ status: "success", data: postComments.reverse() });
});

router.get("/post/:id/page/total", (req, res) => {
  const { id } = req.params;
  const postComments = comments.filter((item) => {
    return item.postId == id;
  });
  const totalPage = Math.ceil(postComments.length / 10);
  res.send({ status: "success", data: totalPage });
});

router.get("/post/:idPost/page/:idPage", (req, res) => {
  const { idPost, idPage } = req.params;
  const postComments = comments.filter((item) => {
    return item.postId == idPost;
  });
  const commentsReverse = [...postComments];
  commentsReverse.reverse();
  const commentPage = commentsReverse.slice((idPage - 1) * 10, idPage * 10);
  res.send({ status: "success", data: commentPage });
});

router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  const userComments = comments.filter((item) => {
    return item.userId == id;
  });
  res.send({ status: "success", data: userComments.reverse() });
});

module.exports = router;
