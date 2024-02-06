const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
} = require("../Controllers/userController");

router.route("/users/register").post(registerUser);
router.route("/users/login").post(loginUser);
router.route("/users").get(getUsers);

module.exports = router;
