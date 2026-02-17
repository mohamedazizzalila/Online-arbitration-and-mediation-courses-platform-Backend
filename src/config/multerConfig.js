  const multer = require('multer');
  const path = require('path');

  // Configure storage for video files
  const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/videos');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  // Configure storage for PDF files
  const pdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/pdfs');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  // Configure storage for image files
  const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const uploadVideo = multer({ storage: videoStorage }).single('video');
  const uploadPDF = multer({ storage: pdfStorage }).single('pdf');
  const uploadImage = multer({ storage: imageStorage }).single('image');

  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (file.fieldname === 'video') {
          cb(null, 'uploads/videos');
        } else if (file.fieldname === 'pdf') {
          cb(null, 'uploads/pdfs');
        } else if (file.fieldname === 'image') {
          cb(null, 'uploads/images');
        }
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    })
  }).fields([
    { name: 'video', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]);

  module.exports = { uploadVideo, uploadPDF, uploadImage, upload };
