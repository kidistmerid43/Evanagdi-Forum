const dbconnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function answerQuestion(req, res) {
	const { userid, questionid, answer } = req.body;

	try {
		await dbconnection.query(
			"INSERT INTO answers (questionid, userid, answer) VALUES (?, ?, ?)",
			[questionid, userid, answer]
		);
		res
			.status(StatusCodes.CREATED)
			.json({ message: "The answer has been posted successfully." });
	} catch (error) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ msg: "Something went wrong. Please try again laterll." });
	}
}
module.exports = { answerQuestion };
