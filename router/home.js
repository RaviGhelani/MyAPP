const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router();
const Joi = require('joi')
const bodyParser = require('body-parser')
const { User } = require('../module/user')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', urlencodedParser, async function (req, res) {
    res.render('home', { title: "Home Page" })
});


module.exports = router;