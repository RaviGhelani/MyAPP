
const { Post } = require('../module/post');


// let allPost = await Post.find().lean();
///loop 
// post.likeCount = like.length;
async function addPost(post) {
    let newPost = new Post(post);
    await newPost.save();
    return newPost;
}

async function getAllPost() {
    let allPost = await Post.find().lean();
    for (let i = 0; i < allPost.length; i++) {
        allPost[i]["likeCount"] = allPost[i].like.length;
    }
    return allPost;
}

async function likePost(userId, postId) {
    let like = await Post.updateOne(
        { _id: postId, like: { $nin: userId } },
        {
            $push: {
                like: userId
            }
        })
    console.log(like);
}


module.exports = {
    addPost: addPost,
    getAllPost: getAllPost,
    likePost: likePost,
    // unlikePost: unlikePost
}
