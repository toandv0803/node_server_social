const userRouter = require("./user/userRouter");
const commentRouter = require("./comment/commentRouter");
const postRouter = require("./post/postRouter");
const imagePostRouter = require("./image-post/imagePostRouter");
const messageRouter = require("./message/message");
const roomChatRouter = require("./room-chat/room-chat");
const userRoomChatRouter = require("./user-room-chat/user-room-chat");
const userFriendRouter = require("./user-friend/user-friend");

function route(app) {
  app.use("/user", userRouter);
  app.use("/comment", commentRouter);
  app.use("/post", postRouter);
  app.use("/image-post", imagePostRouter);
  app.use("/message", messageRouter);
  app.use("/room-chat", roomChatRouter);
  app.use("/user-room-chat", userRoomChatRouter);
  app.use("/user-friend", userFriendRouter);
}

module.exports = route;
