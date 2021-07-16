const express = require("express");
const router = express.Router();
const roomChats = require("./room-chat.json");
const userRoomChat = require("../user-room-chat/user-room-chat.json");
const messages = require("../message/message.json")
const fs = require("fs");
const users = require("../user/user.json");

router.post("/", (req, res) => {
  const { userIds, userLogin } = req.body;
  console.log(userIds);
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
        userIds.push(userLogin)
        userIds.forEach((item) => {
          userRoomChat.push({ roomChatId, userId: item });
        });
        fs.writeFile(
          "./src/routers/user-room-chat/user-room-chat.json",
          JSON.stringify(userRoomChat),
          function (err) {
            if (err) res.sendStatus(500);
            else {
              let roomChatsOfUser = userRoomChat.filter((item) => {
                return item.userId == userLogin;
              })
              roomChatsOfUser = roomChatsOfUser.map((item) => {
                return item.roomChatId
              })
              let allRooms = [];
              roomChatsOfUser.forEach(item => {
                let usersOfRoom = [];
                userRoomChat.forEach(element => {
                  if (element.roomChatId === item) {
                    users.forEach(itemUser => {
                      if (itemUser.id === element.userId) {
                        usersOfRoom.push(itemUser);
                      }
                    })
                  }
                })
                allRooms.push({ roomId: item, data: usersOfRoom });
              })
              res.send({ status: "success",data:allRooms.reverse() })
            };
          }
        );
      }
    }
  );
});

router.delete('/:id', (req, res) => {
  const {id} = req.params;
  console.log(id);
  const indexRoom = roomChats.findIndex(item => {
    return item.id == id;
  })

  let newUserRoomChat = []
  userRoomChat.forEach(item => {
    if (item.roomChatId != id) {
      newUserRoomChat.push(item);
    }
  })

  let newMessages = []
  messages.forEach(item => {
    if (item.roomChatId != id) {
      newMessages.push(item);
    }
  })

  if (newUserRoomChat != null) {
    fs.writeFile(
      './src/routers/user-room-chat/user-room-chat.json',
      JSON.stringify(newUserRoomChat),
      function () {
      }
    )
  }

  if (newMessages !== null) {
    fs.writeFile(
      './src/routers/message/message.json',
      JSON.stringify(newMessages),
      function () {
      }
    )
  }
  console.log(indexRoom);
  if (indexRoom != -1) {
    roomChats.splice(indexRoom, 1);
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
