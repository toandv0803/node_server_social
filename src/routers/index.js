const userRouter = require("./user/userRouter");
const commentRouter = require("./comment/commentRouter");

function route(app) {
  app.use("/user", userRouter);
  app.use("/comment", commentRouter);
}

module.exports = route;
