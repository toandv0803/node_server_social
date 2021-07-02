const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");

const route = require("./routers");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
