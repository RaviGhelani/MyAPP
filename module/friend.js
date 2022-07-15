const mongoose = require('mongoose')


const friendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    friends: [
        {
            friend_name: String,
            frind_user_Id: mongoose.Schema.Types.ObjectId,
        }
    ]   
});



const Friend = mongoose.model('Friend', friendSchema);


module.exports.Friend = Friend;
module.exports.friendSchema = friendSchema;