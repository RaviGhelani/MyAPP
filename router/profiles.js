const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const bcrypt = require('bcrypt')
const express = require('express')
const _ = require('lodash')
const bodyParser = require('body-parser')
const router = express.Router();
const Joi = require('joi')
const { User } = require('../module/user')



var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', async function (req, res) {
    res.render('profile', { title: "Profile Page" })
});

router.post('/', urlencodedParser, auth, async function (req, res) {

    const schema = Joi.object({
        username: Joi.string().required(),
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

    profile = new User(_.pick(req.body, ['username', 'email', 'website', 'address', 'mobile_no', 'gender']));

    await profile.save();
    res.header('x-auth-token', token).send(_.pick(profile, ['username', 'email', 'website', 'address', 'mobile_no', 'gender']));

});


// router.put('/me', auth, async function (req, res) {

//     const schema = Joi.object({
//         name: Joi.string().min(3).max(30).required(),
//         email: Joi.string().min(3).max(255).required().email(),
//         password: Joi.string().min(3).max(255).required(),
//     });

//     try {
//         const value = await schema.validateAsync(req.body);
//         console.log("value", value)
//     }
//     catch (err) {
//         console.log("err", err)
//         res.status(500).send(err.details[0].message);
//         return;
//     }

//     console.log(req.body._id)

//     let user = await User.findOne({ _id: req.user._id });
//     if (!user) return res.status(400).send('user not found..!');

//     console.log(req.user._id)

//     user = await User.findByIdAndUpdate(req.user._id, {
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//     }, { new: true });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt)

//     await user.save();
//     const token = user.generateAuthToken();
//     res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
// });

// router.delete('/:id', [auth, admin], async function (req, res) {
//     const user = await User.findByIdAndRemove(req.params.id);

//     if (!user) {
//         res.status(404).send("user not avalable");
//     }

//     res.send(user);
// });


module.exports = router;