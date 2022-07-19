
const express = require('express')
const router = express.Router();
const queryAuth = require('../middleware/queryAuth')
const bodyParser = require('body-parser')
const { Profile } = require('../module/profile')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', urlencodedParser, queryAuth, async function (req, res) {
    // let profile = await Profile.findOne({ userId: req.user._id })
    // if(!profile){
    //     res.render('addProfile');
    // }
    
    res.render('chat');
    
});


module.exports = router;