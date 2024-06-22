const express = require("express");
const answerRouter = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");
const { answerQuestion } = require("../Controller/answerController");
answerRouter.post("/answerQuestion", answerQuestion);
module.exports = answerRouter;
