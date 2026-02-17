const courseService = require('../services/courseService');

const createCourse = async (req, res) => {
  const { title, description, price } = req.body;
  const imageFilePath = req.file ? req.file.path : null;

  try {
    const course = await courseService.createCourse(title, description, imageFilePath, price);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




const addVideoToCourse = async (req, res) => {
  const { courseId } = req.params;
  const { title, pdfTitle } = req.body;
  const videoFilePath = req.files['video'][0].path;
  const pdfFilePath = req.files['pdf'][0].path;

  try {
    const video = await courseService.addVideoToCourse(courseId, title, videoFilePath, pdfTitle, pdfFilePath);
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await courseService.getCourse(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  console.log(req.file); // Pour vérifier que l'image est bien reçue
  const { courseId } = req.params;
  const { title, description, price } = req.body;
  const imageFilePath = req.file ? req.file.path : undefined;

  try {
      const course = await courseService.updateCourse(courseId, title, description, price, imageFilePath);
      res.status(200).json(course);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};





const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await courseService.deleteCourse(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createCourse,
  addVideoToCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};
