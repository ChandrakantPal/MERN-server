const express = require ('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../util/validation')

router.post('/register',async(req,res) => {
    const {name,email,password} = req.body

    // validation 
    const { error } =  registerValidation(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    // Checking if the user already in DB
    const emailExist = await User.findOne({email: email});
    if (emailExist) return res.status(400).send('Email alredy exists');

    // Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    // Create a new user
    const user = new User({
        name: name,
        email: email,
        password: hashedPassword
    });
    try {
       const savedUser = await user.save();
       res.send({user: user._id}); 
    } catch (err) {
        res.status(400).send(err);
    }
});

// Login
router.post('/login',async (req,res) => {
    // validation 
    const { error } =  loginValidation(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email or Password is incorrect');

    // Password Checking
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Email or Password is incorrect');

    //Create and assign a token
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
        
});


module.exports = router;