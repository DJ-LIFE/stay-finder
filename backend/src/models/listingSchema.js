const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
	hostId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	title: String,
	description: String,
	location: {
		address: String,
		city: String,
		state: String,
		country: String,
		coordinates: [longitude, latitude],
	},
	price: Number,
	images: [String], // URLs
	amenities: [String],
	maxGuests: Number,
	bedrooms: Number,
	bathrooms: Number,
	propertyType: String,
	availability: Boolean,
	createdAt: Date,
	updatedAt: Date,
});

module.exports = mongoose.model("Listing", listingSchema);
