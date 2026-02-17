const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
});

const questionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  text: { type: String, required: true },
  answers: [answerSchema],
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
