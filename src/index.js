const express = require("express");
const bodyParser = require("body-parser");

const route = require("./routers");

const app = express();
const port = 8000;

app.use(bodyParser.json());

route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
