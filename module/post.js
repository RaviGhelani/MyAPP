const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: String,
    like: [ mongoose.Schema.Types.ObjectId],
    dislike: [ mongoose.Schema.Types.ObjectId],
    comment: [
        {
        commenter_Id: mongoose.Schema.Types.ObjectId,
        message: String
        }
    ]
});



const Post = mongoose.model('Post', postSchema);


module.exports.Post = Post;
module.exports.postSchema = postSchema;