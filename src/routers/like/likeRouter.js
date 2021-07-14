const express = require("express");
const router = express.Router();
const pathLike = "./like.json";
const likes = require(pathLike);

const fs = require("fs");

router.post("/", (req, res) => {
  const { userId, postId } = req.body;

  const indexLike = likes.findIndex(
    (like) => like.User_ID === userId && like.Post_ID === postId
  );

  if (userId && postId) {
    if (indexLike === -1) {
      const newLike = {
        id: likes[likes.length - 1].id + 1,
        User_ID: userId,
        Post_ID: postId,
        Time: new Date().getTime(),
      };

      likes.push(newLike);

      fs.writeFile(
        "./src/routers/like/like.json",
        JSON.stringify(likes),
        function writeJSON(err) {
          if (err) return console.log("lỗi", err);
          res.send({ status: "success", data: newLike });
        }
      );
    } else {
      likes.splice(indexLike, 1);

      fs.writeFile(
        "./src/routers/like/like.json",
        JSON.stringify(likes),
        function writeJSON(err) {
          if (err) return console.log("lỗi", err);
          res.send({ status: "success", userId, postId });
        }
      );
    }
  } else {
    res.send({
      status: "userId & postId are required",
    });
  }
});

router.post("/total", (req, res) => {
  const { postId } = req.body;

  if (postId) {
    const listLike = likes.filter((like) => like.Post_ID === postId);

    res.send({
      status: "Success",
      data: {
        totalLike: listLike.length,
        listLike,
      },
    });
  } else {
    res.send({ status: "postId is required" });
  }
});

module.exports = router;
