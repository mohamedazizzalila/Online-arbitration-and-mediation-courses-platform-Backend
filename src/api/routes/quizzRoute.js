const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizzController');
const authMiddleware = require('../middlewares/authMiddleware.js');

router.use(authMiddleware);

router.post('/generate', quizController.generateQuiz);
router.post('/evaluate', quizController.evaluateQuiz);
router.post('/save-result', quizController.saveQuizResult);
router.get('/results', quizController.getAllQuizResults);
router.get('/course/:courseId', quizController.getQuizByCourseId);




module.exports = router;
