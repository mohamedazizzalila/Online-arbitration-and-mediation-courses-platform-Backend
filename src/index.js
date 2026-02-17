require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./api/routes/userRoute');
const courseRoute = require('./api/routes/courseRoute');
const videoRoute = require('./api/routes/videoRoute');
const paymentRoute = require('./api/routes/paymentRoute');
const quizzRoute = require('./api/routes/quizzRoute')
const questionRoute = require('./api/routes/questionRoute')

const path = require('path');
const fs = require('fs');

// Ensure the uploads and subfolders exist
const createUploadsFolders = () => {
  const directories = ['uploads/videos', 'uploads/pdfs'];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Run the function to create the folders
createUploadsFolders();

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/courses', courseRoute);
app.use("/api/users", userRoute);
app.use('/api/videos', videoRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/quizz', quizzRoute);
app.use('/api/questions', questionRoute);

app.get('/', (req, res) => {
    res.send('Hello World');
});

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to db');
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Connection failed', err.message);
  });
