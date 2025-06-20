const express = require("express");
const {
	signin,
	signup,
	getProfile,
	logout,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const {
	getListings,
	getListingById,
} = require("../controllers/listingController");

const router = express.Router();

router.post("/register", signup);
router.post("/login", signin);
router.get("/profile", authMiddleware, getProfile);
router.get("/logout", authMiddleware, logout);

// Listing routes

router.get("/listings", getListings);
router.get("/listings/:id", getListingById);

module.exports = router;
