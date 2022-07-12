const mongoose = require('mongoose')
const users = require('./router/users')
const auth = require('./router/home')
const profile = require('./router/profiles')

const express = require('express')
const app = express();
app.use(express.json());

app.set('view engine', 'ejs')
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/profiles', profile)


mongoose.connect('mongodb://localhost/MyAPP')
    .then(() => console.log('Connected To MongoDB...'))
    .catch(err => console.log('Could not connected to mongoDb...', err))


const port= process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port Number ${port}...`));