const mongoose = require('mongoose');  // Assure-toi que cette ligne est bien présente
const Question = require('../models/questionModel');
const Quiz = require('../models/quizzModel');
const QuizResult = require('../models/quizzresultModel');

async function createRandomQuiz(courseId) {
    const questions = await Question.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      { $sample: { size: 20 } } // Ajustez la taille à 20 questions
    ]);
  
    const quiz = new Quiz({
      courseId: new mongoose.Types.ObjectId(courseId),
      questions: questions.map((q) => q._id),
    });
  
    await quiz.save();
  
    // Populer les questions pour renvoyer tous les détails
    const populatedQuiz = await Quiz.findById(quiz._id).populate('questions');
    return populatedQuiz;
  }
  

async function getQuizByCourseId(courseId) {
    // Trouver le quiz correspondant à l'ID du cours et populate les questions
    const quiz = await Quiz.findOne({ courseId: courseId }).populate('questions');
    return quiz;
  }

async function evaluateQuiz(quizId, userAnswers) {
    // Récupérer le quiz et ses questions
    const quiz = await Quiz.findById(quizId).populate('questions');
  
    let score = 0;
  
    for (const userAnswer of userAnswers) {
      // Trouver la question correspondante dans le quiz
      const question = quiz.questions.find(q => q._id.toString() === userAnswer.questionId);
  
      if (question) {
        // Trouver la bonne réponse
        const correctAnswer = question.answers.find(answer => answer.isCorrect);
  
        if (userAnswer.answerId === correctAnswer._id.toString()) {
          score += 1; // Réponse correcte
        } else {
          score -= 1; // Réponse incorrecte
        }
      }
    }
  
    return score;
  }

  async function saveQuizResult(userId, quizId, score) {
    const result = new QuizResult({
        userId,
        quizId,
        score,
        createdAt: new Date(),
    });
    await result.save();
    return result;
}

module.exports = {
  createRandomQuiz,
  getQuizByCourseId,
  evaluateQuiz,
  saveQuizResult
};
