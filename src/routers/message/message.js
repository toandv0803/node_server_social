const express = require("express");
const router = express.Router();
const messages = require("./message.json");
const fs = require("fs");

router.get("/page/total", (req, res) => {
  const totalPage = Math.ceil(messages.length / 10);
  res.send({ status: "success", data: totalPage });
});

router.get("/page/:id", (req, res) => {
  const { id } = req.params;
  const messageReveser = [...messages];
  messageReveser.reverse();
  const messagePage = messageReveser.slice((id - 1) * 10, id * 10);
  res.send({ status: "success", data: messagePage });
});

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
  const roomChatMessages = messages.filter((item) => {
    return item.roomChatId == id;
  });
  res.send({ status: "success", data: roomChatMessages.reverse() });
});

module.exports = router;
