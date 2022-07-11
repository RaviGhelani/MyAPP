const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const bcrypt = require('bcrypt')
const express = require('express')
const _ = require('lodash')
const router = express.Router();
const Joi = require('joi')
const { User } = require('../module/user')

// router.get('/', async function (req, res) {

//     User.paginate({}, { page: req.query.page, limit: req.query.limit })
//         .then(response => {
//             res.send({
//                 response
//             })
//         })
//                 .catch(error => {
//                     res.status(500).send({
//                         message: "error: " + error
//                     })
//                 })
// });

router.get('/', async function (req, res) {
    res.render('login', {title: "Login System"})
});

router.get('/me', auth, async function (req, res) {

    const user = await User.findById(req.user.id).select('-password');
    res.send(user);

});

router.post('/', async function (req, res) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(255).required(),
        isAdmin: Joi.boolean()
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

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('user already registered!..');

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));

});

router.put('/me', auth, async function (req, res) {

    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(255).required(),
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

    console.log(req.body._id)

    let user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(400).send('user not found..!');

    console.log(req.user._id)

    user = await User.findByIdAndUpdate(req.user._id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }, { new: true });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.delete('/:id', [auth, admin], async function (req, res) {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) {
        res.status(404).send("user not avalable");
    }

    res.send(user);
});


module.exports = router;