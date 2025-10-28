const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function getAllQuestions(req, res) {
  try {
    const [rows] = await dbConnection.execute(
      `SELECT q.questionid, q.title, u.username, q.created_at FROM questions q JOIN users u ON q.userid=u.userid ORDER BY q.created_at DESC`
    );

    res.status(StatusCodes.OK).json(rows);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "failed to load questions!" });
  }
}

async function getQuestionById(req, res) {
  const questionid = req.params?.questionid;

  try {
    const [question] = await dbConnection.execute(
      `SELECT q.questionid, q.title, q.description, u.username FROM questions q JOIN users u ON q.userid=u.userid WHERE q.questionid=?`,
      [questionid]
    );

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "question not found!" });
    }

    const [answers] = await dbConnection.execute(
      `SELECT a.answer_text, u.username FROM answer a JOIN users u ON a.userid=u.userid WHERE a.questionid=?`,
      [questionid]
    );

    res.status(StatusCodes.OK).json({ Q: question[0], answers });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "failed to load question!" });
  }
}

const generateQuestionId = () => {
  const prefix = "Q";
  const timestamp = new Date().getTime().toString().slice(-8);
  const random = Math.random().toString(36).slice(2, 12);
  return `${prefix}${timestamp}${random}`;
};

async function addQuestion(req, res) {
  const questionid = generateQuestionId();
  const { title, description } = req.body;
  const { userid } = req.user;

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: " all are fields required" });
  }

  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  if (trimmedTitle.length == 0 || trimmedDescription.length == 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Fields cannot be empty!" });
  }

  if (trimmedTitle.length > 200) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "too long title!" });
  }

  try {
    await dbConnection.execute(
      `INSERT INTO questions (questionid, userid, title, description, created_at) VALUES (?,?,?,?,?)`,
      [questionid, userid, trimmedTitle, trimmedDescription, new Date()]
    );

    res
      .status(StatusCodes.CREATED)
      .json({ msg: "question posted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "failed to post question" });
  }
}

async function addAnswer(req, res) {
  const { questionid } = req.params;
  const { answer } = req.body;
  const { userid } = req.user;

  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "answer is required!" });
  }

  const trimmedAnswer = answer.trim();
  if (trimmedAnswer.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "answer can't be empty!" });
  }

  try {
    const [result] = await dbConnection.execute(
      `INSERT INTO answer (userid, questionid, answer_text) VALUES  (?,?,?)`,
      [userid, questionid, trimmedAnswer]
    );

    const [answerData] = await dbConnection.execute(
      `SELECT a.answer_text, u.username FROM answer a JOIN users u ON a.userid=u.userid WHERE a.answerid=?`,
      [result.insertId]
    );

    res.status(StatusCodes.CREATED).json({
      answer: answerData[0].answer_text,
      username: answerData[0].username,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "failed to post answer!" });
  }
}

module.exports = { getAllQuestions, getQuestionById, addQuestion, addAnswer };
