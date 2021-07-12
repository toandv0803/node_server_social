const express = require("express");
const router = express.Router();
const posts = require("./post.json");
const fs = require("fs");
const multer = require("multer");
const { v4 } = require("uuid");
const imagePosts = require("../image-post/image-post.json");

router.get("/", (req, res) => {
  const postsReveser = [...posts];
  postsReveser.reverse();
  res.send({ status: "success", data: postsReveser });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((item) => {
    return item.id == id;
  });
  if (!post) res.sendStatus(500);
  res.send({ status: "success", data: post });
});

router.get("/page/total", (req, res) => {
  const totalPage = Math.ceil(posts.length / 10);
  res.send({ status: "success", data: totalPage });
});

router.get("/page/:id", (req, res) => {
  const { id } = req.params;
  const postsReveser = [...posts];
  postsReveser.reverse();
  const postPage = postsReveser.slice((id - 1) * 10, id * 10);
  res.send({ status: "success", data: postPage });
});

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/../../asset/image-post");
  },
  filename: function (req, file, callback) {
    const newFileName = v4() + file.originalname;
    imagePosts.push({
      id: imagePosts[imagePosts.length - 1].id + 1,
      postId: posts[posts.length - 1].id + 1,
      imageUrl: "http://localhost:8000/image-post/" + newFileName,
    });
    fs.writeFile(
      "./src/routers/image-post/image-post.json",
      JSON.stringify(imagePosts),
      function (err) {
        if (err) res.sendStatus(500);
      }
    );
    callback(null, newFileName);
  },
});

const upload = multer({ storage: storage }).any("image");

router.post("/", upload, (req, res) => {
  const { userId, content } = req.body;
  const time = new Date().getTime();
  const newId = posts[posts.length - 1].id + 1;
  posts.push({
    id: newId,
    content,
    time,
    userId: +userId,
  });
  fs.writeFile(
    "./src/routers/post/post.json",
    JSON.stringify(posts),
    function (err) {
      if (err) res.sendStatus(500);
      else {
        upload(req, res, function (err) {
          if (err) {
            return res.sendStatus(500);
          }
          res.send({ status: "success", idPost: newId });
        });
      }
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const idPost = posts.findIndex((item) => {
    return item.id == id;
  });
  if (idPost == -1) res.sendStatus(500);
  else {
    posts[idPost].content = content;
    fs.writeFile(
      "./src/routers/post/post.json",
      JSON.stringify(posts),
      function (err) {
        if (err) res.sendStatus(500);
        else res.send({ status: "success" });
      }
    );
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const idPost = posts.findIndex((item) => {
    return item.id == id;
  });
  if (idPost == -1) res.sendStatus(500);
  else {
    posts.splice(idPost, 1);
    fs.writeFile(
      "./src/routers/post/post.json",
      JSON.stringify(posts),
      function (err) {
        if (err) res.sendStatus(500);
        else res.send({ status: "success" });
      }
    );
  }
});

router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  const userPosts = posts.filter((item) => {
    return item.userId == id;
  });
  res.send({ status: "success", data: userPosts.reverse() });
});

router.get("/user/:id/page/total", (req, res) => {
  const { id } = req.params;
  const userPosts = posts.filter((item) => {
    return item.userId == id;
  });
  const totalPage = Math.ceil(userPosts.length / 10);
  res.send({ status: "success", data: totalPage });
});

router.get("/user/:userId/page/:pageId", (req, res) => {
  const { userId, pageId } = req.params;
  const userPosts = posts.filter((item) => {
    return item.userId == userId;
  });
  const postsReveser = [...userPosts];
  postsReveser.reverse();
  const postPage = postsReveser.slice((pageId - 1) * 10, pageId * 10);
  res.send({ status: "success", data: postPage });
});

module.exports = router;
