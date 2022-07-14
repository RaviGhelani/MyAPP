const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser')


var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', urlencodedParser, async function (req, res) {
    res.render('home', { title: "Home Page" })
});


module.exports = router;