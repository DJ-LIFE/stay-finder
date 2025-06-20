const express = require("express");
const { signin, signup, getProfile, logout } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/register", signup);
router.post("/login", signin);
router.get("/profile", authMiddleware,getProfile);
router.get("/logout", authMiddleware, logout);


module.exports = router;
