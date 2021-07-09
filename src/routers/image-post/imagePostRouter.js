const express = require("express");
const router = express.Router();
const imagePosts = require("./image-post.json");
const fs = require("fs");

router.get("/:name", (req, res) => {
  const { name } = req.params;
  fs.readFile("./src/asset/image-post/" + name, function (err, data) {
    if (err) throw err;
    res.end(data);
  });
});

router.get("/post/:id", (req, res) => {
  const { id } = req.params;
  const postImages = imagePosts.filter((item) => {
    return item.postId == id;
  });
  res.send({ status: "success", data: postImages });
});

module.exports = router;
