const express = require("express");
const router = express.Router();

router.get("/info", (req, res) => {
  res.send({
    name: "toan",
  });
});

module.exports = router;
