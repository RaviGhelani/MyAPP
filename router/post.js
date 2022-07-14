const auth = require('../middleware/auth')
const queryAuth = require('../middleware/queryAuth')
const admin = require('../middleware/admin')
const express = require('express')
const _ = require('lodash')
const bodyParser = require('body-parser')
const router = express.Router();
const Joi = require('joi')
const { Profile } = require('../module/profile')
const { User } = require('../module/user')


var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', urlencodedParser, async function (req, res) {
    res.render('post')
});



module.exports = router;