
const { Post } = require('../module/post');

async function addPost(post) {
    let newPost = new Post(post);
    await newPost.save();
    return newPost;
}

async function getAllPost() {
    let allPost = await Post.find();
    return allPost;
}

async function likePost(userId, postId) {
    // let allPost = await Post.find().lean();
    ///loop 
    // post.likeCount = like.length;
    console.log(postId)
    let like = await Post.updateOne(
        { _id: postId },
        {
            $push: {
                like: userId
                }
        })

    return like;
}

module.exports = {
    addPost: addPost,
    getAllPost: getAllPost,
    likePost: likePost,
    // unlikePost: unlikePost
}
