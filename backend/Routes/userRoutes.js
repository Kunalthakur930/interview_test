const userController = require("../Controller/userController");
const express = require("express");
const router = express.Router();
router.post("/saveUser", userController.saveUser);
router.post("/loginUser", userController.loginUser);
router.post("/refreshToken", userController.refreshToken);
module.exports = router;
