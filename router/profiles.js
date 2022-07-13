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

router.get('/editProfile', async function (req, res) {
    res.render('editProfile', { title: "Edit Profile Page" })
});

router.get('/addProfile', async function (req, res) {
    res.render('addProfile', { title: "ADD Profile Page" })
});

router.get('/', queryAuth, async function (req, res) {

    let userId = req.user._id;
    console.log("userId::::::", userId)

    res.render('profile', { title: "Profile Page" })
});

router.get('/me', urlencodedParser, auth, async function (req, res) {
    // const user = await Profile.find({ userId: req.user._id });
    // res.send(user);
});

router.post('/', urlencodedParser, queryAuth, async function (req, res) {

    const schema = Joi.object({
        username: Joi.string(),
        email: Joi.string().min(3).max(255).required().email(),
        website: Joi.string(),
        address: Joi.string(),
        gender: Joi.string().valid('Male', 'Female', 'Other').required(),
        mobile_no: Joi.string().min(6).max(16).required(),
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

    let profile = await Profile.findOne({ userId: req.user._id });
    if (profile) return res.status(400).send('already have profile... go to update if you want to change anything...!');

    profile = new Profile({
        username: req.body.username,
        email: req.body.email,
        website: req.body.website,
        address: req.body.address,
        mobile_no: req.body.mobile_no,
        gender: req.body.gender,
        userId: req.user._id,
    });
    await profile.save();
    res.send(profile);

    console.log(profile);

});


router.put('/', queryAuth, async function (req, res) {

    const schema = Joi.object({
        username: Joi.string(),
        email: Joi.string().min(3).max(255).email(),
        website: Joi.string(),
        address: Joi.string(),
        gender: Joi.string().valid('Male', 'Female', 'Other'),
        mobile_no: Joi.string().min(6).max(16),
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

    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) return res.status(400).send('First you have to Add profile..!');

    console.log(profile)

    profile = await Profile.findByIdAndUpdate( req.user._id, {
        username: req.body.username,
        email: req.body.email,
        website: req.body.website,
        address: req.body.address,
        mobile_no: req.body.mobile_no,
        gender: req.body.gender,
    }, { new: true });

    console.log(profile)

    await profile.save();
    res.send(profile);

    console.log(profile);
});

router.delete('/:id', [auth, admin], async function (req, res) {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) {
        res.status(404).send("user not avalable");
    }

    res.send(user);
});


module.exports = router;