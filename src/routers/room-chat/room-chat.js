const express = require("express");
const router = express.Router();
const roomChats = require("./room-chat.json");
const userRoomChat = require("../user-room-chat/user-room-chat.json");
const fs = require("fs");

router.post("/", (req, res) => {
  const { userIds } = req.body;
  const roomChatId = roomChats[roomChats.length - 1].id + 1;
  roomChats.push({
    id: roomChatId,
  });
  fs.writeFile(
    "./src/routers/room-chat/room-chat.json",
    JSON.stringify(roomChats),
    function (err) {
      if (err) res.sendStatus(500);
      else {
        userIds.forEach((item) => {
          userRoomChat.push({ roomChatId, userId: item });
          fs.writeFile(
            "./src/routers/user-room-chat/user-room-chat.json",
            JSON.stringify(userRoomChat),
            function (err) {
              if (err) res.sendStatus(500);
              else res.send({ status: "success" });
            }
          );
        });
      }
    }
  );
});

module.exports = router;
