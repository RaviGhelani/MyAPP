
const { Post } = require('../module/post');


async function addPost(post) {
    let newPost = new Post(post);
    await newPost.save();
    return newPost;
}

async function getAllPost() {
    let allPost = await Post.find().lean();
    for (let i = 0; i < allPost.length; i++) {
        allPost[i]["likeCount"] = allPost[i].like.length;
        allPost[i]["dislikeCount"] = allPost[i].dislike.length;
    }
    return allPost;
}

async function likePost(userId, postId) {
    let like = await Post.updateOne(
        { _id: postId, like: { $nin: userId } },
        {
            $push: {
                like: userId
            },
            $pull: {
                dislike: userId
            }
        })
}

async function dislikePost(userId, postId) {
    let dislike = await Post.updateOne(
        { _id: postId, dislike: { $nin: userId } },
        {
            $push: {
                dislike: userId
            }, $pull: {
                like: userId
            }
        })
}

async function addComment(commentMessage, userId, postId) {
    let newcomment = await Post.updateOne(
        { _id: postId },
        {
            $push: {
                comment: [{
                    commenter_Id: userId,
                    message: commentMessage
                }]
            },
        })
    console.log(newcomment);
}

module.exports = {
    addPost: addPost,
    getAllPost: getAllPost,
    likePost: likePost,
    dislikePost: dislikePost,
    addComment: addComment
}