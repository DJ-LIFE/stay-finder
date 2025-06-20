const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
	try {
		const token =
			req.cookies.token || req.headers.authorization?.split(" ")[1];
		if (!token) {
			return res
				.status(401)
				.json({ message: "Access denied, no token provided" });
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Make sure decoded contains the id property needed by controllers
		if (!decoded.id) {
			return res
				.status(401)
				.json({ message: "Invalid token structure, missing user ID" });
		}

		// Set user._id to be compatible with existing controller code
		req.user = {
			...decoded,
			_id: decoded.id,
		};
		next();
	} catch (error) {
		console.error(error, "Auth error");
		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = authMiddleware;
