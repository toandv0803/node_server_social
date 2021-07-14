const express = require("express");
const router = express.Router();
const messages = require("./message.json");
const fs = require("fs");
const users = require("../user/user.json");

router.post("/", (req, res) => {
  const { userId, roomChatId, content } = req.body;
  const time = new Date().getTime();
  messages.push({
    id: messages[messages.length - 1].id + 1,
    roomChatId,
    userId,
    content,
    time,
  });
  fs.writeFile(
    "./src/routers/message/message.json",
    JSON.stringify(messages),
    function (err) {
      if (err) res.sendStatus(500);
      else res.send({ status: "success" });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const idMessage = messages.findIndex((item) => {
    return item.id == id;
  });
  if (idMessage == -1) res.sendStatus(500);
  else {
    messages.splice(idMessage, 1);
    fs.writeFile(
      "./src/routers/message/message.json",
      JSON.stringify(messages),
      function (err) {
        if (err) res.sendStatus(500);
        else res.send({ status: "success" });
      }
    );
  }
});

router.get("/room-chat/:id", (req, res) => {
  const { id } = req.params;
  let roomChatMessages = messages.filter((item) => {
    return item.roomChatId == id;
  });
  roomChatMessages.forEach(item => {
    users.forEach(element => {
      if(item.userId === element.id){
        item.avatar = element.Avatar;
      }
    })  
  })
  res.send({ status: "success", data: roomChatMessages.reverse() });
});

router.get("/room-chat/:id/page/total", (req, res) => {
  const { id } = req.params;
  const roomChatMessages = messages.filter((item) => {
    return item.roomChatId == id;
  });
  const totalPage = Math.ceil(roomChatMessages.length / 10);
  res.send({ status: "success", data: totalPage });
});

router.get("/room-chat/:idRoomChat/page/:idPage", (req, res) => {
  const { idRoomChat, idPage } = req.params;
  const roomChatMessages = messages.filter((item) => {
    return item.roomChatId == idRoomChat;
  });
  const messageReveser = [...roomChatMessages];
  messageReveser.reverse();
  const messagePage = messageReveser.slice((idPage - 1) * 10, idPage * 10);
  res.send({ status: "success", data: messagePage });
});

module.exports = router;
