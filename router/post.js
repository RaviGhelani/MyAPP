const queryAuth = require('../middleware/queryAuth')
const express = require('express')
const _ = require('lodash')
const bodyParser = require('body-parser')
const router = express.Router();
const Joi = require('joi')
const { Post } = require('../module/post')


var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', urlencodedParser, async function (req, res) {
    res.render('post')
});

router.post('/', urlencodedParser, queryAuth, async function (req, res) {

    console.log(req.body.date)

    const schema = Joi.object({
        message: Joi.string(),
        // like: Joi.string().min(3).max(255).required().email(),
        // comment: Joi.string(),
    });

    try {
        const value = await schema.validateAsync(req.body);
        console.log("value", value)
    }
    catch (err) {
        console.log("err", err)
        res.status(500).send(err.details[0].message);
        return;
    }

    

    let post = await Post.findOne({ userId: req.user._id });
    if (post) return res.status(400).send('already have profile... go to update if you want to change anything...!');

    post = new Post({
        message: req.body.message,
        userId: req.user._id,
    });
    await post.save();
    res.send(JSON.stringify(post));

    console.log(post);

});


module.exports = router;