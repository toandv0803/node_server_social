const express = require("express");
const router = express.Router();
const userRoomChats = require("./user-room-chat.json");
const users = require("../user/user.json");
const fs = require("fs");

router.delete("/user/:userId/room-chat/:roomChatId", (req, res) => {
  const { userId, roomChatId } = req.params;
  const userRoomChat = userRoomChats.findIndex((item) => {
    return item.userId == userId && item.roomChatId == roomChatId;
  });
  if (userRoomChat == -1) res.sendStatus(500);
  else {
    userRoomChats.splice(userRoomChat, 1);
    fs.writeFile(
      "./src/routers/user-room-chat/user-room-chat.json",
      JSON.stringify(userRoomChats),
      function (err) {
        if (err) res.sendStatus(500);
        else res.send({ status: "success" });
      }
    );
  }
});

router.get("/room-chat/user/:id", (req, res) => {
  const { id } = req.params;
  var roomChatsOfUser = userRoomChats.filter((item) => {
    return item.userId == id;
  });
  roomChatsOfUser = roomChatsOfUser.map((item) => {
    return item.roomChatId;
  });
  res.send({ status: "success", data: roomChatsOfUser.reverse() });
});

router.get("/user/room-chat/:id", (req, res) => {
  const { id } = req.params;
  var usersOfRoomChat = userRoomChats.filter((item) => {
    return item.roomChatId == id;
  });
  usersOfRoomChat = usersOfRoomChat.map((item) => {
    const user = users.find((itemUser) => {
      return itemUser.id == item.userId;
    });
    if (user)
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      };
  });
  res.send({ status: "success", data: usersOfRoomChat.reverse() });
});

module.exports = router;
