const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const config = require('../config/key');


const createToken = id => {
    return  jwt.sign({id}, config.secretKey, {expiresIn: '1h'});

}

router.get('/users', async(req, res, next) => {
  let users;
    try {
        users = await User.find({});
    } catch (error) {
        return next(new HttpError('Something went wrong. Please try again', 500));
    }
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});


router.post('/register', async (req, res, next) => {
    const {name, email, password} = req.body;
    let newUser;
    try {
        newUser = await User.create({email, name, password});
    } catch (error) {
        return next(new HttpError('Something went wrong. Please try again', 500));
    }
    
    const token = createToken(newUser._id);
    res.status(200).json({
             status: 'success',
             token,
             data: {
                 user: newUser
             }
    });
});

router.post('/login', async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new HttpError('Need required fields', 400))
    }

    let user;
    try {
         user = await User.findOne({email}).select('+password');

    } catch (error) {
        return next(new HttpError('Something went wrong', 500));
    }
   
    if(!user || !(await user.comparePassword(password, user.password))) {
        return next(new HttpError('Incorrect credentials', 401));
    }

    const token = createToken(user._id);
    res.status(200).json({
        status:'success',
        token
    });
});

module.exports = router;

