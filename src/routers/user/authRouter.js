const express = require("express");
const router = express.Router();
const pathUsers = "./user.json";
const users = require(pathUsers);
const { generateToken } = require("../../helper/commonFnc/generateToken");

const fs = require("fs");

router.post("/login", (req, res) => {
  if (req.body.email && req.body.password) {
    const user = users.find((user) => user.Email === req.body.email);
    if (user) {
      if (user.Password === req.body.password) {
        res.send({
          data: {
            user,
          },
          status: "Success",
        });
      } else res.send({ status: "Password does not exist" });
    } else res.send({ status: "Email does not exist" });
  } else res.send({ status: "Email & password is Required" });
});

router.post("/register", (req, res) => {
  const { email, password, confirmPassword, fullName } = req.body;
  if (email && password && confirmPassword && fullName) {
    const user = users.find((user) => user.Email === email);
    if (user) {
      res.send({
        status: "Email already exists",
      });
    } else {
      if (password === confirmPassword) {
        const newUser = {
          id: users[users.length - 1].id + 1,
          Name: fullName,
          Email: email,
          Password: password,
          Address: "",
          Avatar: "http://dummyimage.com/250x250.png/dddddd/000000",
          Banner: "http://dummyimage.com/300x100.png/5fa2dd/ffffff",
          Age: "",
          Gender: "",
          Token: generateToken(64),
        };

        users.push(newUser);

        fs.writeFile(
          "./src/routers/user/user.json",
          JSON.stringify(users),
          function writeJSON(err) {
            if (err) return console.log("lỗi", err);
            res.send({ status: "success" });
          }
        );
      } else res.send({ status: "wrong confirmation password" });
    }
  } else res.send({ status: "Error message" });
});

module.exports = router;
