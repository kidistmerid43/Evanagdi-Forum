// to verify the token

const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// now we send token through header not like req.body

async function authMiddleware(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ message: "No token provided/Authentication: Invalid" });
	}

	const token = authHeader.split(" ")[1];
	console.log("Authorization Header:", authHeader);
	console.log("Token:", token);
	try {
		const { username, userid } = jwt.verify(token, process.env.JWT_SECRET);

		req.user = { username, userid };
		

		next();
	} catch (error) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ message: "Authentication: Invalid" });
	}
}
module.exports = authMiddleware;
