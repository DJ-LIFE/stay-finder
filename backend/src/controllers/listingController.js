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

const createListing = async (req, res) => {
    try {
        // Check if user is a host
        const user = req.user;
        if (user.role !== "host") {
            return res.status(403).json({ 
                success: false, 
                message: "Only hosts can create listings" 
            });
        }

        const newListing = new Listing({
            ...req.body,
            hostId: user._id, // Use the authenticated user's ID
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newListing.save();

        res.status(201).json({
            success: true,
            message: "Listing created successfully",
            data: newListing
        });
    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        // Check if listing exists
        if (!listing) {
            return res.status(404).json({ 
                success: false, 
                message: "Listing not found" 
            });
        }

        // Check if user is the owner of the listing
        if (listing.hostId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: "You can only update your own listings" 
            });
        }

        // Update listing with new data
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                updatedAt: new Date()
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            data: updatedListing
        });
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        // Check if listing exists
        if (!listing) {
            return res.status(404).json({ 
                success: false, 
                message: "Listing not found" 
            });
        }

        // Check if user is the owner of the listing
        if (listing.hostId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: "You can only delete your own listings" 
            });
        }

        await listing.deleteOne();

        res.status(200).json({
            success: true,
            message: "Listing deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting listing:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getHostListings = async (req, res) => {
    try {
        const listings = await Listing.find({ hostId: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: listings.length,
            data: listings
        });
    } catch (error) {
        console.error("Error fetching host listings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
	getListings,
	getListingById,
    createListing,
    updateListing,
    deleteListing,
    getHostListings
};
