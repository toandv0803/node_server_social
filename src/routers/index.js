const userRouter = require("./user/userRouter");

function route(app) {
  app.use("/user", userRouter);
}

module.exports = route;
