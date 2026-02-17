const questionService = require('../services/questionService');

async function createQuestion(req, res) {
  try {
    const { courseId, text, answers } = req.body;
    const question = await questionService.createQuestion(courseId, text, answers);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getQuestionById(req, res) {
  try {
    const { id } = req.params;
    const question = await questionService.getQuestionById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getQuestionsByCourseId(req, res) {
  try {
    const { courseId } = req.params;
    const questions = await questionService.getQuestionsByCourseId(courseId);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllQuestions(req, res) {
  try {
    const questions = await questionService.getAllQuestions();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const question = await questionService.updateQuestion(id, updatedData);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    const question = await questionService.deleteQuestion(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(204).json(); // No Content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createQuestion,
  getQuestionById,
  getQuestionsByCourseId,
  getAllQuestions,  // Export getAllQuestions
  updateQuestion,
  deleteQuestion,
};
