const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
	guestId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	listingId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Listing",
		required: true,
	},
	checkIn: {
		type: Date,
		required: true,
	},
	checkOut: {
		type: Date,
		required: true,
	},
	guests: {
		type: Number,
		required: true,
		min: 1,
	},
	totalPrice: {
		type: Number,
		required: true,
		min: 0,
	},
	status: {
		type: String,
		enum: ["pending", "confirmed", "cancelled"],
		default: "pending",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});
