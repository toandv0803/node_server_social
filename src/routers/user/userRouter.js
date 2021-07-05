const express = require("express");
const router = express.Router();
const pathUsers = "./user.json";
const users = require(pathUsers);

const fs = require("fs");

router.post("/info", (req, res) => {
  if (req.body.userId) {
    const idx = users.findIndex((user) => user.ID === req.body.userId);
    if (idx === -1) {
      res.send({ status: "user does not exist" });
    } else
      res.send({
        status: "Success",
        data: users[idx],
      });
  } else res.send({ status: "userId is not undefined" });
});

router.post("/update", (req, res) => {
  if (req.body.userId) {
    const newUser = req.body;
    const idx = users.findIndex((user) => user.ID === newUser.userId);
    if (idx === -1) {
      res.send({ status: "user does not exist" });
    } else {
      users[idx] = {
        ...users[idx],
        ...newUser,
      };

      fs.writeFile(
        "./src/routers/user/user.json",
        JSON.stringify(users),
        function writeJSON(err) {
          if (err) return console.log("lỗi", err);
          res.send({ status: "success" });
        }
      );
    }
  } else res.send({ status: "Erorr server" });
});

router.post("/friend-suggest", (req, res) => {
  Math.floor(Math.random() * (users.length + 1));

  let listUserSuggest = [];

  for (let index = 0; index < 10; index++) {
    const indexUser = Math.floor(Math.random() * (users.length + 1));
    listUserSuggest.push(users[indexUser]);
  }

  res.send({
    status: "Success",
    data: listUserSuggest,
  });
});

router.post("/search-user", (req, res) => {
  const { textSearch } = req.body;
  let resultSearch = [];
  if (textSearch) {
    users.forEach((user) => {
      const checkingSearch =
        user.Name.match(textSearch) || user.Email.match(textSearch);

      console.log("checking", checkingSearch);
      if (checkingSearch !== null && resultSearch.length < 5) {
        resultSearch.push(user);
      }
    });

    res.send({ Status: "Success", data: resultSearch });
  } else {
    res.send({
      status: "textSearch is required",
    });
  }
});

module.exports = router;
