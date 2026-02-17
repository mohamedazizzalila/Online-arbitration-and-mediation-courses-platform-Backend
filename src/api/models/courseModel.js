const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  price: { type: Number, required: true },  // Added price field
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
