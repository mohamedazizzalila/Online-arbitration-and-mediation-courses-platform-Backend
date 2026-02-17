const userService = require('../services/userService');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Course = require('../models/courseModel');

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        console.log('Received data:', req.body); // Pour voir les données reçues
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: error.message });
    }
};


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.updateUser(id, req.body);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.deleteUser(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const signUp = async (req, res) => {
    try {
        const { user, token } = await userService.signUp(req.body);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userService.signIn(email, password);
        //console.log('Generated Token:', token);  // Ajoutez cette ligne pour le débogage
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const sendPasswordResetEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const token = await userService.generatePasswordResetToken(email);
        if (token) {
            await userService.sendPasswordResetEmail(email, token);
            return res.status(200).json({ message: 'Password reset email sent' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const success = await userService.resetPassword(token, newPassword);
        if (success) {
            return res.status(200).json({ message: 'Password reset successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyCourses = async (req, res) => {
    try {
        //console.log('req.user:', req.user); // Debugging line
        const userId = req.user.id || req.user._id;  // Ensure you are using the correct identifier
        const courses = await userService.getMyCourses(userId);
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    signUp,
    signIn,
    sendPasswordResetEmail,
    resetPassword,
    getMe,
    getMyCourses
    
};
