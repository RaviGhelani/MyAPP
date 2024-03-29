const mongoose = require('mongoose')
const ejs = require('ejs')
const users = require('./router/users')
const home = require('./router/home')
const profile = require('./router/profiles')
const chat = require('./router/globleChat')
const post = require('./router/post')
const postController = require('./controller/postController')

const express = require('express')
const app = express();
app.use(express.json());

app.set('view engine', 'ejs')
app.use('/api/users', users)
app.use('/', home)
app.use('/api/profiles', profile)
app.use('/api/chats', chat)
app.use('/api/post', post)

const http = require('http').createServer(app)

const io = require('socket.io')(http)

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })
    socket.on("addPost", async post => {
        let newPost = await postController.addPost(post)
        // console.log(post)
        io.emit("newPost", newPost)
    });
    socket.on("postList", async () => {
        let newPost = await postController.getAllPost()
        socket.emit("postList", newPost)
    });
    socket.on("likeClick", async (userId, postId) => {
        let newPost = await postController.likePost(userId, postId)
        socket.emit("like", newPost)
    });
    socket.on("dislikeClick", async (userId, postId) => {
        let newPost = await postController.dislikePost(userId, postId)
        socket.emit("dislike", newPost)
    });
    socket.on("newComment", async (commentMessage, userId, postId) => {
        let newPost = await postController.addComment(commentMessage, userId, postId)
        // socket.emit("dislike", newPost)
    });
})

io.on('disconnect', function () { 
    console.log('Disconnected from server');
});

mongoose.connect('mongodb://127.0.0.1:27017/MyAPP')
    .then(() => console.log('Connected To MongoDB...'))
    .catch(err => console.log('Could not connected to mongoDb...', err))


// const port= process.env.PORT || 3000;
// app.listen(port, () => console.log(`listening to port Number ${port}...`));