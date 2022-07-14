
const express = require('express')
const router = express.Router();
const queryAuth = require('../middleware/queryAuth')
const bodyParser = require('body-parser')
const { User } = require('../module/user')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', urlencodedParser, queryAuth, async function (req, res) {
    res.render('chat')
});


module.exports = router;