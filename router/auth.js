const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router();
const Joi = require('joi')
const bodyParser = require('body-parser')
const { User } = require('../module/user')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post('/logIn', urlencodedParser, async function (req, res) {

    console.log(req.body.email)

    const schema = Joi.object({
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

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email!..');

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid password!..');

    const token = user.generateAuthToken();

    res.send(token);
    localStorage.setItem("x-auth-token", token);
});


module.exports = router;