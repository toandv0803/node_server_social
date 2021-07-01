const authRouter = require("./user/authRouter");
const userRouter = require("./user/userRouter");
const likeRouter = require("./like/likeRouter");
const commentRouter = require("./comment/commentRouter");

function route(app) {
  app.use("/like", likeRouter);
  app.use("/user", userRouter);
  app.use("/comment", commentRouter);
  app.use("/", authRouter);
}

module.exports = route;
