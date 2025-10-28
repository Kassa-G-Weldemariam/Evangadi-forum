const express = require("express");
const route = express.Router();
const {
  getAllQuestions,
  getQuestionById,
  addQuestion,
  addAnswer,
} = require("../controller/questionController");

route.get("/", getAllQuestions);

route.get("/:questionid", getQuestionById);

route.post("/", addQuestion);

route.post("/:questionid/answers", addAnswer);

module.exports = route;
