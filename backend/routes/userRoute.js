const express = require("express");
const {
  createUser,
  userLogin,
  updateUserByEmail,
  uploadUserAvatar,
  changeUserPassword,
  resetPassword,
} = require("../controller/userController.js");

const upload = require("../middleware/upload.js");
const route = express.Router();

route.post("/user", createUser);
route.post("/user/login", userLogin);

route.post(
  "/user/upload-avatar/:email",
  upload.single("avatar"),
  uploadUserAvatar
);

route.put("/user/change-password", changeUserPassword);
route.put("/user/:email", updateUserByEmail);
route.post("/reset-password", resetPassword);

module.exports = route;
