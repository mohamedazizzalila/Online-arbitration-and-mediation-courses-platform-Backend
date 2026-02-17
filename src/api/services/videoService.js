const Video = require('../models/videoModel');
const Course = require('../models/courseModel');
const PDF = require('../models/pdfModel');

const createVideo = async (title, courseId, videoFile, pdfFile, duration) => {
    let pdfId = null;
    if (pdfFile) {
      const pdf = new PDF({
        title: title, // Utilisez le même titre pour le PDF ou modifiez selon vos besoins
        filePath: pdfFile.path,
        // Assurez-vous de ne pas définir 'video' ici pour éviter une référence circulaire
      });
      await pdf.save();
      pdfId = pdf._id;
    }
  
    const video = new Video({
      title,
      filePath: videoFile.path,
      course: courseId,
      pdf: pdfId,
      duration
    });
  
    await video.save();
  
    if (pdfId) {
      // Mettez à jour le document PDF avec l'ID de la vidéo
      await PDF.findByIdAndUpdate(pdfId, { video: video._id });
    }
  
    if (courseId) {
      await Course.findByIdAndUpdate(courseId, { $push: { videos: video._id } });
    }
  
    return video;
  };

const getVideos = async () => {
  return Video.find().populate('course');
};

const getVideoById = async (id) => {
  return Video.findById(id).populate('course');
};

const updateVideo = async (id, title, courseId, videoFile, pdfFile, duration, pdfTitle) => {
  const video = await Video.findById(id);
  if (!video) throw new Error('Video not found');

  video.title = title || video.title;
  video.duration = duration || video.duration;

  if (videoFile) {
      video.filePath = videoFile.path;
  }

  // Mise à jour du fichier PDF et du titre du PDF
  if (pdfFile || pdfTitle) {
      let pdf;
      if (video.pdf) {
          pdf = await PDF.findById(video.pdf);
      }
      
      if (pdf) {
          if (pdfFile) {
              pdf.filePath = pdfFile.path;
          }
          if (pdfTitle) {
              pdf.title = pdfTitle;
          }
          await pdf.save();
      } else if (pdfFile) {
          // Si aucun PDF n'est associé, créez un nouveau PDF
          const newPdf = new PDF({
              title: pdfTitle || video.title, // Utilisez le titre du PDF si fourni, sinon le titre de la vidéo
              filePath: pdfFile.path,
          });
          await newPdf.save();
          video.pdf = newPdf._id;
      }
  }

  if (courseId && courseId !== video.course.toString()) {
      await Course.findByIdAndUpdate(video.course, { $pull: { videos: video._id } });
      video.course = courseId;
      await Course.findByIdAndUpdate(courseId, { $push: { videos: video._id } });
  }

  await video.save();
  return video;
};




const deleteVideo = async (id) => {
  const video = await Video.findByIdAndDelete(id);
  if (!video) throw new Error('Video not found');

  // Remove video reference from course
  if (video.course) {
    await Course.findByIdAndUpdate(video.course, { $pull: { videos: video._id } });
  }

  return video;
};

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo
};
