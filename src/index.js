const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const cors = require("cors");
const {
  get_Current_User,
  user_Disconnect,
  join_User,
} = require("./helper/userSocket");

const route = require("./routers");

const app = express();
const port = 8000;

app.use(express());
app.use(bodyParser.json());
app.use(cors());

route(app);

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const io = socket(server);

//initializing the socket io connection
io.on("connection", (socket) => {
  //for a new user joining the room
  socket.on("joinRoom", ({ idUser, username, roomname }) => {
    //* create user
    const p_user = join_User(socket.id, idUser, username, roomname);
    console.log(roomname, "=id");
    socket.join(p_user.room);

    //display a welcome message to the user who have joined a room
    socket.emit("message", {
      userId: p_user.idUser,
      username: p_user.username,
      active: true,
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(p_user.room).emit("message", {
      userId: p_user.idUser,
      username: p_user.username,
      active: true,
    });
  });

  //user sending message
  socket.on("chat", ({ text, roomname }) => {
    //gets the room user and the message sent
    const p_user = get_Current_User(socket.id);

    if (p_user) {
      io.to(roomname).emit("message", {
        userId: p_user.idUser,
        username: p_user.username,
        text: text,
      });
    } else {
      socket.emit("message", {
        userId: "",
        username: "",
        text: "conversation does not exist",
      });
    }
  });

  //when the user exits the room
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.idUser,
        username: p_user.username,
        active: false,
      });
    }
  });
});
