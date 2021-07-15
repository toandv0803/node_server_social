const express = require("express");
const router = express.Router();
const roomChats = require("./room-chat.json");
const userRoomChat = require("../user-room-chat/user-room-chat.json");
const messages = require("../message/message.json")
const fs = require("fs");
const e = require("express");

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

router.delete('/:id',(req,res) => {
  const { id } = req.params;
  const indexRoom = roomChats.findIndex(item =>{
    return item.id == id;
  })
  roomChats.splice(indexRoom,1);

  let newUserRoomChat =  []
  userRoomChat.forEach(item => {
    if(item.roomChatId != id){
      newUserRoomChat.push(item);
    }
  })

  let newMessages = []
  messages.forEach(item => {
    if(item.roomChatId != id){
      newMessages.push(item);
    }
  })
  
  if(newUserRoomChat != null){
    fs.writeFile(
      './src/routers/user-room-chat/user-room-chat.json',
      JSON.stringify(newUserRoomChat),
      function () {
        
      }
    )
  }

  if(newMessages !== null){
    fs.writeFile(
      './src/routers/message/message.json',
      JSON.stringify(newMessages),
      function () {
       
      }
    )
  }

  if(indexRoom != -1){
    fs.writeFile(
      './src/routers/room-chat/room-chat.json',
      JSON.stringify(roomChats),
      function (err) {
        if (err) res.sendStatus(500);
        else res.send({ status: "success", id: id });
      }
    )
  }
  else res.send({ status: "false" });
})

module.exports = router;
