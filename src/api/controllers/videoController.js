const videoService = require('../services/videoService');

const createVideo = async (req, res) => {
    try {
      const { title, courseId, duration } = req.body;
      const videoFile = req.files['video'] ? req.files['video'][0] : null;
      const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;
        
      if (!videoFile) {
        return res.status(400).send('Video file is required');
      }
      console.log("Duration received:", duration);
      const video = await videoService.createVideo(title, courseId, videoFile, pdfFile, duration);
      res.status(201).json(video);
    } catch (error) {
      res.status(500).json({ error: error.message });
    
    }
    

  };

const getVideos = async (req, res) => {
  try {
    const videos = await videoService.getVideos();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await videoService.getVideoById(req.params.id);
    if (!video) {
      return res.status(404).send('Video not found');
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVideo = async (req, res) => {
  try {
      const { title, courseId, duration } = req.body;
      const videoFile = req.files['video'] ? req.files['video'][0] : null;
      const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;

      console.log('Received video file:', videoFile); // Vérifiez si la vidéo est reçue
      console.log('Received pdf file:', pdfFile); // Vérifiez si le PDF est reçu
      console.log('Received body:', req.body);

      const video = await videoService.updateVideo(req.params.id, title, courseId, videoFile, pdfFile, duration);
      res.json(video);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



const deleteVideo = async (req, res) => {
  try {
    await videoService.deleteVideo(req.params.id);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo
};
