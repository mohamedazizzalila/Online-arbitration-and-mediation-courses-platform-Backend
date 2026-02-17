const Question = require('../models/questionModel');

async function createQuestion(courseId, text, answers) {
  const question = new Question({
    courseId,
    text,
    answers,
  });
  await question.save();
  return question;
}

async function getQuestionById(questionId) {
  return await Question.findById(questionId).populate('courseId');
}

async function getQuestionsByCourseId(courseId) {
  return await Question.find({ courseId }).populate('courseId');
}

async function getAllQuestions() {
    return await Question.find().select('courseId text answers'); // Fetch all questions but only include courseId, text, and answers
  }
  

async function updateQuestion(questionId, updatedData) {
  const question = await Question.findByIdAndUpdate(
    questionId,
    { $set: updatedData },
    { new: true, runValidators: true }
  );
  return question;
}

async function deleteQuestion(questionId) {
  return await Question.findByIdAndDelete(questionId);
}

module.exports = {
  createQuestion,
  getQuestionById,
  getQuestionsByCourseId,
  getAllQuestions,  // Export getAllQuestions
  updateQuestion,
  deleteQuestion,
};
