const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");

const route = require("./routers");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(bodyParser.json());

route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
