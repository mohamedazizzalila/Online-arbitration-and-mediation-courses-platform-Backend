const quizService = require('../services/quizzService');
const QuizResult = require('../models/quizzresultModel');


async function generateQuiz(req, res) {
  try {
    const { courseId } = req.body;
    const quiz = await quizService.createRandomQuiz(courseId);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getQuizByCourseId(req, res) {
    try {
      const { courseId } = req.params;
      const quiz = await quizService.getQuizByCourseId(courseId);
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      res.status(200).json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

async function evaluateQuiz(req, res) {
    try {
      const { quizId, userAnswers } = req.body;
      const score = await quizService.evaluateQuiz(quizId, userAnswers);
      res.status(200).json({ score });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async function saveQuizResult(req, res) {
    try {
      const { userId, quizId, score } = req.body;
      const result = await quizService.saveQuizResult(userId, quizId, score);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async function getAllQuizResults(req, res) {
    try {
      const quizResults = await QuizResult.find()
        .populate('userId', 'firstname lastname')
        .populate({
          path: 'quizId',
          populate: {
            path: 'courseId',
            select: 'title'
          }
        });
      res.status(200).json(quizResults);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

module.exports = {
  generateQuiz,
  getQuizByCourseId,
  evaluateQuiz,
  saveQuizResult,
  getAllQuizResults
};
