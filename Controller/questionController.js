const dbconnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
async function question(req, res) {
  // const userid = req.user.userid;
  //Generate a random 10-digit number
  const questionId = Math.floor(1000000000 + Math.random() * 9000000000);
  const { userid, title, description } = req.body;
  if (!title || !description || !userid || !questionId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }
  try {
    if (description.length > 200) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "The number of characters for Description must be less than or equal to 200.",
      });
    }
    if (title.length > 50) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "The number of characters for Title must be less than or equal to 50.",
      });
    }
    await dbconnection.query(
      "INSERT INTO questions (questionid, userid, title, description) VALUES (?, ?, ?, ?)",
      [questionId, userid, title, description]
    );

    res
      .status(StatusCodes.CREATED)
      .json({ message: "The question has been successfully submitted!" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong. Please try again later." });
  }
}
//
//
//
//
//
//
//
//
//
//
//
async function selectquestion(req, res) {
  try {
    // const username = req.user.username;
    const query = `
      SELECT users.username, questions.title,questions.questionid 
      FROM users 
      JOIN questions ON users.userid = questions.userid ORDER BY questions.id DESC`;
    const [rows] = await dbconnection.query(query);
    const AllQuestions = rows.map((row) => ({
      username: row.username,
      title: row.title,
      questionid: row.questionid,
    }));
    return res.status(StatusCodes.OK).json({
      // Welcome: ` ${username}`,
      AllQuestions: AllQuestions,
    });
  } catch (error) {
    // console.error("Error executing SQL query:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong. Please try again later." });
  }
}

async function selectsinglequestion(req, res) {
  const { questionId } = req.query; // Use req.query to access query parameters

  try {
    const query = `
      SELECT questions.title, questions.description 
      FROM questions 
      WHERE questionid = ?`; // Use parameterized queries to prevent SQL injection
    const [rows] = await dbconnection.query(query, [questionId]);

    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }
    const question = rows[0];
    return res.status(StatusCodes.OK).json({ question });
  } catch (error) {
    // console.error("Error executing SQL query:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong. Please try again later." });
  }
}

async function selectansawer(req, res) {
  const { questionId } = req.query;
  try {
    const query = `
      SELECT users.username, answers.answer
      FROM users 
      JOIN answers ON users.userid = answers.userid AND answers.questionid =? `;
    const [rows] = await dbconnection.query(query, [questionId]);
    if (rows.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }
    const Allanswers = rows.map((row) => ({
      username: row.username,
      answer: row.answer,
    }));
    return res.status(StatusCodes.OK).json({ Allanswers });
  } catch (error) {
    // console.error("Error executing SQL query:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong. Please try again later." });
  }
}

module.exports = {
  question,
  selectquestion,
  selectsinglequestion,
  selectansawer,
};
