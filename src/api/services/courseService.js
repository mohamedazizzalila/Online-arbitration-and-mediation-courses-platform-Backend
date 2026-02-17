const Course = require('../models/courseModel');
const Video = require('../models/videoModel');
const PDF = require('../models/pdfModel');

const createCourse = async (title, description, imageFilePath, price) => {
  const course = new Course({ title, description, image: imageFilePath, price });
  await course.save();
  return course;
};

const updateCourse = async (courseId, title, description, price, imageFilePath) => {
  const course = await Course.findById(courseId);
  if (!course) {
      throw new Error('Course not found');
  }

  course.title = title || course.title;
  course.description = description || course.description;
  course.price = price !== undefined ? price : course.price;
  
  if (imageFilePath) { // Vérifiez ici si imageFilePath est bien défini
      course.image = imageFilePath;
  }

  await course.save();
  return course;
};





const addVideoToCourse = async (courseId, title, videoFilePath, pdfTitle, pdfFilePath) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  const pdf = new PDF({ title: pdfTitle, filePath: pdfFilePath });
  await pdf.save();

  const video = new Video({ title, filePath: videoFilePath, course: course._id, pdf: pdf._id });
  await video.save();

  course.videos.push(video._id);
  await course.save();

  return video;
};

const getAllCourses = async () => {
  const courses = await Course.find().populate({
    path: 'videos',
    populate: { path: 'pdf' }
  });
  return courses;
};

const getCourse = async (courseId) => {
  const course = await Course.findById(courseId).populate({
    path: 'videos',
    populate: { path: 'pdf' }
  });
  if (!course) {
    throw new Error('Course not found');
  }
  return course;
};




const deleteCourse = async (courseId) => {
  const course = await Course.findByIdAndDelete(courseId);
  if (!course) {
    throw new Error('Course not found');
  }
  return course;
};



module.exports = {
  createCourse,
  addVideoToCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};
