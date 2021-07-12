const express = require("express");
const router = express.Router();
const pathUsers = "./user.json";
const users = require(pathUsers);

const fs = require("fs");

router.post("/info", (req, res) => {
  if (req.body.userId) {
    console.log("body:::", req.body);
    const idx = users.findIndex((user) => user.id === req.body.userId);
    if (idx === -1) {
      res.send({ status: "user does not exist" });
    } else
      res.send({
        status: "Success",
        data: users[idx],
      });
  } else res.send({ status: "userId is not undefined" });
});

router.get("/token/:tokenAuth", (req, res) => {
  if (req.params.tokenAuth) {
    const idx = users.findIndex((user) => user.Token === req.params.tokenAuth);
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
    const currentUser = req.body;
    const idx = users.findIndex((user) => user.id === currentUser.userId);
    if (idx === -1) {
      res.send({ status: "user does not exist" });
    } else {
      users[idx] = {
        ...users[idx],
        ...currentUser,
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
  const textSearch = req.body.textSearch;
  const page = Math.round(req.body.page);
  const limit = Math.round(req.body.limit);
  let resultSearch = [];
  if (textSearch && page && limit) {
    users.forEach((user) => {
      const checkingSearch =
        user.Name.match(textSearch) || user.Email.match(textSearch);

      if (checkingSearch !== null) {
        resultSearch.push(user);
      }
    });

    if (resultSearch.length > 0) {
      const totalUser = resultSearch.length;
      const totalPage = Math.ceil(resultSearch.length / limit);
      if (page > totalPage) {
        res.send({
          Status: "page does not exist",
        });
      } else {
        res.send({
          Status: "Success",
          data: {
            totalUser,
            totalPage,
            currentPage: page,
            resultSearch: resultSearch.slice(
              page * limit - limit,
              page * limit
            ),
          },
        });
      }
    } else {
      res.send({
        Status: "Success",
        data: { totalUser: 0, totalPage: 0, resultSearch: [] },
      });
    }
  } else {
    res.send({
      status: "textSearch is required",
    });
  }
});

module.exports = router;
