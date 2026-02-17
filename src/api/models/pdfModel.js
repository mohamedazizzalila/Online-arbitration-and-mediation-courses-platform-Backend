const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filePath: { type: String, required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' }
}, { timestamps: true });

const PDF = mongoose.model('PDF', pdfSchema);

module.exports = PDF;
