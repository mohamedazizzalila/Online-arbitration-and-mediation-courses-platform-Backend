const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filePath: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  pdf: { type: mongoose.Schema.Types.ObjectId, ref: 'PDF' },
  duration: { type: Number, required: false }
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
