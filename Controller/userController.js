const dbconnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes"); 

async function register(req, res) {
	const { username, firstname, lastname, email, password } = req.body;
	if (!username || !firstname || !lastname || !email || !password) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "All fields are required" });
	}
	try {
	
	
		const [user] = await dbconnection.query(
			"SELECT userid,username from users WHERE username = ? or email = ?",
			[username, email]
		);
		// return res.json({userinformation:user})
		if (user.length > 0) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "user already registered" });
		}
		if (password.length <= 8) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Password must be at least 8 characters long" });
		}
		// Best Practice
		const saltRounds = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		await dbconnection.query(
			"INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
			[username, firstname, lastname, email, hashedPassword]
		);

		// Send a success response
		res
			.status(StatusCodes.CREATED)
			.json({ message: "User registered successfully" });
	} catch (error) {
		// // Handle errors
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ msg: "Something went wrong. Please try again later." });
	}
}

async function login(req, res) {
	const { email, password } = req.body;
	if (!email || !password) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "All fields are required" });
	}
	try {
		const [user] = await dbconnection.query(
			"SELECT userid,username,password from users WHERE email=?",
			[email]
		);
		// return res.json({ user: user });

		if (user.length == 0) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Invalid credentials" });
		}
		// compare the actual password with decrypted one
		const isMatch = await bcrypt.compare(password, user[0].password);
		if (!isMatch) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Invalid credentialsp " });
		}

	

		// Define the payload
		const username = user[0].username;
		const userid = user[0].userid;
		// Define the secret key
		const secret = process.env.JWT_SECRET;
		// Define options
		const options = { expiresIn: "1d" };
		// Create the token
		const token = jwt.sign({ username, userid }, secret, options);

		return res
			.status(StatusCodes.OK)
			.json({ message: "User Logged In", token, username });
	} catch (error) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ msg: "Something went wrong. Please try again later." });
	}
}
async function checkUser(req, res) {
	const username = req.user.username;
	const userid = req.user.userid;

	res
		.status(StatusCodes.OK)
		.json({ message: "valid user", username, userid });
}
module.exports = { register, login, checkUser };
