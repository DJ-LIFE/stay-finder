const express = require("express");
const cors = require("cors");
const dbConnection = require("./config/dbConnection");
require("dotenv").config();
const router = require("./routes/index");
const cookieParser = require("cookie-parser");

// Initialize the Express application
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// Connect to the database
dbConnection();

app.get("/health", (req, res) => {
	res.send("API is running...");
});

app.use("/api", router);

app.listen(process.env.PORT || 8081, () => {
	console.log(`Server is running on port ${process.env.PORT || 8081}`);
});
