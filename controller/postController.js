
const { Post } = require('../module/post');
const { post } = require('../router/post');

async function addPost(post) {
    let newPost = new Post(post);
    await newPost.save();
    return newPost;
}

async function getAllPost() {
    // let allPost = await Post.find().lean();
    let allPost = await Post.find();
    ///loop 
    // post.likeCount = like.length;
    
    return allPost;
}

module.exports = {
    addPost: addPost,
    getAllPost: getAllPost,
    // likePost: likePost,
    // unlikePost: unlikePost
}
