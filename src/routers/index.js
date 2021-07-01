const authRouter = require("./user/authRouter");
const userRouter = require("./user/userRouter");
const likeRouter = require("./like/likeRouter");

function route(app) {
  app.use("/like", likeRouter);
  app.use("/user", userRouter);
  app.use("/", authRouter);
}

module.exports = route;
