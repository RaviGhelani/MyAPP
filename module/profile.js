const mongoose = require('mongoose');
// const { userSchema, User } = require('./user');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        unique: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    mobile_no: {
        type: String,
        minlength: 6,
        maxlength: 16,
    },
    address: {
        type: String,
    },
    website: {
        type: String,
    }
});


const Profile = mongoose.model('Profile', profileSchema);


module.exports.Profile = Profile;
module.exports.profileSchema = profileSchema;