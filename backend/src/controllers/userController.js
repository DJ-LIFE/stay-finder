const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
	const { name, email, password, role } = req.body;
	try {
		if (!name || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}
		if (password.length < 8) {
			return res.status(400).json({
				message: "Password must be at least 8 characters long",
			});
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({
			name,
			email,
			password: hashedPassword,
			role: role || "guest",
		});
		await user.save();

		const token = jwt.sign(
			{ id: user._id, email },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);
		const isProduction = process.env.NODE_ENV === "production";
		res.cookie("token", token, { httpOnly: true, secure: isProduction });

		res.status(201).json({
			success: true,
			message: "User created successfully",
			token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Unable to create user, please try again later",
		});
	}
};

const signin = async (req, res) => {
	const { email, password } = req.body;
	try {
		if (!email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ message: "Invalid email or Password" });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid password" });
		}
		const token = jwt.sign(
			{ id: user._id, email },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);
		res.cookie("token", token, { httpOnly: true, secure: true });
		res.status(200).json({ message: "User signed in successfully", token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getProfile = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}
		res.status(200).json({ success: true, user });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const logout = async (req, res) => {
	try {
		res.clearCookie("token");
		res.status(200).json({ message: "User logged out successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = { signup, signin, getProfile, logout };
