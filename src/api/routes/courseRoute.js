const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController.js');
const { uploadImage,upload } = require('../../config/multerConfig.js');
const authMiddleware = require('../middlewares/authMiddleware.js');



router.get('/', courseController.getAllCourses);
router.get('/:courseId', courseController.getCourse);
    

router.use(authMiddleware);

router.post('/', uploadImage, courseController.createCourse); 
router.post('/:courseId/videos', upload, courseController.addVideoToCourse);
router.delete('/:courseId', courseController.deleteCourse);
router.put('/:courseId', uploadImage, courseController.updateCourse);

module.exports = router;
