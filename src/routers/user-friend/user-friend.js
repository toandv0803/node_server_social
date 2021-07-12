const express = require("express");
const router = express.Router();
const userFriends = require("./user-friend.json");
const users = require("../user/user.json");
const fs = require("fs");

router.post("/", (req, res) => {
  const { user1Id, user2Id } = req.body;
  userFriends.push({
    user1Id,
    user2Id,
    status: "request",
  });
  fs.writeFile(
    "./src/routers/user-friend/user-friend.json",
    JSON.stringify(userFriends),
    function (err) {
      if (err) res.sendStatus(500);
      else res.send({ status: "success" });
    }
  );
});

router.delete("/", (req, res) => {
  const { user1Id, user2Id } = req.body;
  const userFriend = userFriends.findIndex((item) => {
    return (
      (item.user1Id == user1Id && item.user2Id == user2Id) ||
      (item.user2Id == user1Id && item.user1Id == user2Id)
    );
  });
  if (userFriend == -1) res.sendStatus(500);
  else {
    userFriends.splice(userFriend, 1);
    fs.writeFile(
      "./src/routers/user-friend/user-friend.json",
      JSON.stringify(userFriends),
      function (err) {
        if (err) res.sendStatus(500);
        else res.send({ status: "success" });
      }
    );
  }
});

router.put("/", (req, res) => {
  const { user1Id, user2Id } = req.body;
  const userFriend = userFriends.findIndex((item) => {
    return (
      (item.user1Id == user1Id && item.user2Id == user2Id) ||
      (item.user2Id == user1Id && item.user1Id == user2Id)
    );
  });
  if (userFriend == -1) res.sendStatus(500);
  else {
    userFriends[userFriend].status = "accepted";
    fs.writeFile(
      "./src/routers/user-friend/user-friend.json",
      JSON.stringify(userFriends),
      function (err) {
        if (err) res.sendStatus(500);
        else res.send({ status: "success" });
      }
    );
  }
});

router.get("/check-friend/:user1Id/:user2Id", (req, res) => {
  const { user1Id, user2Id } = req.params;
  var checkFriend = userFriends.find((item) => {
    return (
      (item.user1Id == user1Id && item.user2Id == user2Id) ||
      (item.user2Id == user1Id && item.user1Id == user2Id)
    );
  });
  if (!checkFriend) res.send({ status: "success", relation: "none" });
  if (checkFriend.status == "accepted")
    res.send({ status: "success", relation: "friend" });
  else if (checkFriend.status == "request" && user1Id == checkFriend.user1Id)
    res.send({ status: "success", relation: "wait" });
  else res.send({ status: "success", relation: "request" });
});

router.get("/friend/user/:id", (req, res) => {
  const { id } = req.params;
  var friendsOfUser = userFriends.filter((item) => {
    return (
      (item.user1Id == id && item.status == "accepted") ||
      (item.user2Id == id && item.status == "accepted")
    );
  });
  friendsOfUser = friendsOfUser.map((item) => {
    var friendId;
    if (item.user1Id == id) friendId = item.user2Id;
    else friendId = item.user1Id;
    const user = users.find((itemUser) => {
      return itemUser.id == friendId;
    });
    if (user)
      return {
        id: user.id,
        name: user.Name,
        avatar: user.Avatar,
      };
  });
  res.send({ status: "success", data: friendsOfUser.reverse() });
});

router.get("/friend-request/user/:id", (req, res) => {
  const { id } = req.params;
  var friendsAddOfUser = userFriends.filter((item) => {
    return item.user2Id == id && item.status == "request";
  });
  friendsAddOfUser = friendsAddOfUser.map((item) => {
    const user = users.find((itemUser) => {
      return itemUser.id == item.user1Id;
    });
    if (user)
      return {
        id: user.id,
        name: user.Name,
        avatar: user.Avatar,
      };
  });
  res.send({ status: "success", data: friendsAddOfUser.reverse() });
});

router.get("/wait-accept/user/:id", (req, res) => {
  const { id } = req.params;
  var friendsWaitOfUser = userFriends.filter((item) => {
    return item.user1Id == id && item.status == "request";
  });
  friendsWaitOfUser = friendsWaitOfUser.map((item) => {
    const user = users.find((itemUser) => {
      return itemUser.id == item.user2Id;
    });
    if (user)
      return {
        id: user.id,
        name: user.Name,
        avatar: user.Avatar,
      };
  });
  res.send({ status: "success", data: friendsWaitOfUser.reverse() });
});

module.exports = router;
