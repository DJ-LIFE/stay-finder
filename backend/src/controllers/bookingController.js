const Booking = require("../models/bookingSchema");
const booking = async (req, res) => {
	try {
		const { listingId, startDate, endDate, totalPrice, guests } = req.body;

		// Validate required fields
		if (!listingId || !startDate || !endDate || !totalPrice || !guests) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Create booking with field names matching the schema
		const bookingData = {
			listingId,
			guestId: req.user._id, // Changed from userId to guestId
			checkIn: new Date(startDate), // Changed from startDate to checkIn
			checkOut: new Date(endDate), // Changed from endDate to checkOut
			totalPrice: parseFloat(totalPrice),
			guests: parseInt(guests), // Make sure to include the guests field
		};

		console.log("Creating booking with data:", bookingData);

		const newBooking = new Booking(bookingData);
		await newBooking.save();

		res.status(201).json({
			success: true,
			message: "Booking created successfully",
			data: newBooking,
		});
	} catch (error) {
		console.error("Error creating booking:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	booking,
};
