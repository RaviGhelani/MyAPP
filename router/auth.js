const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router();
const Joi = require('joi')
const { User } = require('../module/user')


router.post('/', async function (req, res) {
    
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

    const token= user.generateAuthToken();

    res.send(token);
});


module.exports = router;