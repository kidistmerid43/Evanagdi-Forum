require("dotenv").config();
const express = require("express");
const app = express();
const port = 5500;
const cors = require("cors");
app.use(cors());
const dbconnection = require("./db/dbConfig");
//user routes middleware file
const userRoutes = require("./routes/userRoute");
const askqueastionroutes = require("./routes/questionRoute");

const authMiddleware =require('./Middleware/authMiddleware')


const answerquestions = require("./routes/answerRoute");

app.use(express.json()); 

app.use("/api/users", userRoutes); //user route middleware
app.use("/api/question",authMiddleware, askqueastionroutes); 
//question route middleware
app.use("/api/answer", answerquestions); 
//answer route middleware
//
//
//
//
//
async function start() {
	try {
		const result = await dbconnection.execute("select 'test'");
		await app.listen(port);
		console.log("database connection established");
		console.log(`listneing on port ${port}`);
	} catch (error) {
		console.log(error.message);
	}
}
start();
