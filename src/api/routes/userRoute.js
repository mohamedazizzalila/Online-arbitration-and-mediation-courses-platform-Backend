// Importer les modules nécessaires
const express = require("express");
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser, signUp, signIn, getMe, getMyCourses } = require('../controllers/userController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const userController = require('../controllers/userController.js');

// Routes publiques
router.post("/signup", signUp);
router.post("/signin", signIn);

router.post('/forgot-password', userController.sendPasswordResetEmail);
router.post('/reset-password', userController.resetPassword);





// Appliquer le middleware d'authentification à toutes les routes suivantes
router.use(authMiddleware);

// Routes protégées
router.get('/me',getMe);
router.get('/my-courses', getMyCourses);
router.get('/', getUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);



module.exports = router;
