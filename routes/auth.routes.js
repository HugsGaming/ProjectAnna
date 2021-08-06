const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

const router = express.Router();

const handleError = err => {
    console.error(err.message, err.code);
    let errors = {email: '', password: ''};

    if(err.message === 'Incorrect Email') {
        errors.email = 'Email is not registered';
        return errors;
    }

    if(err.message === 'Incorrect Password') {
        errors.password = 'Password is Incorrect';
        return errors;
    }

    if(err.message === 'Mismatch Password and Confirm Password') { 
        errors.password = 'Password and Confirm Password do not match!'
        return errors;
    }

    if(err.code === 11000){
        errors.email = "Email already in used";
        return errors;
    }

    if(err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

const maxAge = 7 * 24 * 60 * 60;
const createToken = id => {
    return jwt.sign({id}, process.env.SECRET, {expiresIn: maxAge}); 
}

router.get('/signup', (req, res) => {
    res.render('signup', {title: 'Sign Up'});
});

router.get('/login', (req, res) => {
    res.render('login', {title: 'Login'});
});

router.post('/signup', async (req, res) => {
    const {email, password, confirmPassword} = req.body;
    try {
        if(password != confirmPassword) {
            throw new Error('Mismatch Password and Confirm Password');
        }
        const user = await User.create({ email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000, secure: true});
        res.status(200).json({user: user._id});
    } catch (err) {
        handleError(err);
        console.log(errors);
        res.status(400).json({errors});
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.logIn(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000, secure: true});
        res.status(200).json({user: user._id});
    } catch (err) {
        const errors = handleErrors(err);
        console.log(errors);
        res.status(400).json({errors})
    }
})

router.get('/signout' , (req, res) => {
    res.cookie('jwt', null, {maxAge: 1});
    res.redirect('/');
})

module.exports = router;
