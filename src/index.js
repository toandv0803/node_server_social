const express = require("express");
const app = express();
const port = 8000;

const route = require("./routers");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
