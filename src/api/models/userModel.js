    const mongoose = require('mongoose');

    const userSchema = mongoose.Schema({
        firstname: {
            type: String,
            required: [true, 'Please enter your first name']
        },
        lastname: {
            type: String,
            required: [true, 'Please enter your last name'] 
        },
        docType: {
            type: String,
            enum: ['passport', 'permit', 'id'], // Enum to restrict to specific values
            default: 'passport',
            required: [true, 'Please select a document type']
        },
        cin: {
            type: String,
            required: [true, 'Please enter your CIN (national ID)'],
            unique: true
        },
        nationality: {
            type: String
        },
        phone: {
            type: String
        },
        email: {
            type: String,
            required: [true, 'Please enter your email'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please enter your password'],
            minlength: [6, 'Too short password'], 
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        purchasedCourses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }],
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    }, 
    {
        timestamps: true
    });

    module.exports = mongoose.model('User', userSchema);
