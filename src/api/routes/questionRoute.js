const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware.js');




router.use(authMiddleware);

router.post('/', questionController.createQuestion);
router.get('/:id', questionController.getQuestionById);
router.get('/course/:courseId', questionController.getQuestionsByCourseId);
router.get('/', questionController.getAllQuestions);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
