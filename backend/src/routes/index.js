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
	createListing,
	updateListing,
	deleteListing,
	getHostListings,
} = require("../controllers/listingController");
const { booking } = require("../controllers/bookingController");

const router = express.Router();

router.post("/register", signup);
router.post("/login", signin);
router.get("/profile", authMiddleware, getProfile);
router.get("/logout", authMiddleware, logout);

// Listing routes

router.get("/listings", getListings);
router.get("/listings/:id", getListingById);

router.post("/listings", authMiddleware, createListing);
router.put("/listings/:id", authMiddleware, updateListing);
router.delete("/listings/:id", authMiddleware, deleteListing);
router.get("/host/listings", authMiddleware, getHostListings);

// Booking routes
router.post("/booking", authMiddleware, booking);

module.exports = router;
