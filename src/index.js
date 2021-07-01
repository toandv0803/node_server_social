const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 8000;

const route = require("./routers");

app.use(bodyParser.json());

route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
