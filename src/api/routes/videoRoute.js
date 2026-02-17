const express = require('express');
const { upload } = require('../../config/multerConfig');
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();


router.use(authMiddleware);
router.post('/', upload, videoController.createVideo);


router.get('/', videoController.getVideos);
router.get('/:id', videoController.getVideoById);
router.put('/:id', upload, videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);



module.exports = router;
