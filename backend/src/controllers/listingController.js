const Listing = require("../models/listingSchema");
const getListings = async (req, res) => {
	try {
		const { location, minPrice, maxPrice, data } = req.query;
		const filter = {};
		if (location) {
			filter.$or = [
				{ "location.city": new RegExp(location, "i") },
				{ "location.country": new RegExp(location, "i") },
			];
		}

		if (minPrice || maxPrice) {
			filter.price = {};
			if (minPrice) filter.price.$gte = parseFloat(minPrice);
			if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
		}

		// if (date) {
		// 	filter.availability = true; // Assuming availability is a boolean field
		// }

		const listings = await Listing.find(filter)
			.populate("hostId", "name email")
			.sort({ createdAt: -1 });
		res.status(200).json({
			success: true,
			count: listings.length,
			data: listings,
		});
	} catch (error) {
		console.error("Error fetching listings:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getListingById = async (req, res) => {
	try {
		const listing = await Listing.findById(req.params.id);
		if (!listing) {
			return res.status(404).json({ error: "Listing not found" });
		}
		await listing.populate("hostId", "name email");
		res.status(200).json({ success: true, data: listing });
	} catch (error) {
		console.error("Error fetching listing:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	getListings,
	getListingById,
};
