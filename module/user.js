const mongoose = require('mongoose')
// const mongoosePaginate = require('mongoose-paginate-v2');
const config = require('config')
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({
    User_name: {
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
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024,
    },
    isAdmin: Boolean
});

// userSchema.plugin(mongoosePaginate);

userSchema.methods.generateAuthToken = function () { 
    const token= jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

// User.paginate().then({});

module.exports.User = User;
module.exports.userSchema = userSchema;