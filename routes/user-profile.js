const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const HttpError = require('../models/http-error');
const checkAuth = require('../middleware/auth');


router.get('/:id', checkAuth, async(req,res, next) => {
    const userId = req.params.id;
    let user;
    let posts;
    try {
        user = await User.findById(userId);
       
    } catch (error) {
        return next(new HttpError('Something went wrong', 500));
    }

    if (!user) {
        return next(new HttpError('No user with such id', 404));
    }

    try {
        posts = await Post.find({author:userId});
    } catch (error) {
        return next(new HttpError('Something went wrong', 500));
    }

    res.status(200).json({
        message:'success',
        data: {
            user,
            posts
        }
    });
});


module.exports = router;