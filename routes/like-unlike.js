const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const HttpError = require('../models/http-error');
const checkAuth = require('../middleware/auth');

router.put('/like-post/:id', checkAuth, async(req, res, next) => {
    const postId = req.params.id;
    const {id} = req.userData;
    let post;
    try {
        post = await Post.findByIdAndUpdate(postId, {
            $push:{likes: id}
        }, {
            new: true
        })
    } catch (error) {
        return next(new HttpError('Something went wrong', 500));
    }

    if(!post) {
        return next(new HttpError('No post with such id', 404));
    }

    res.status(200).json({
        message:'success',
        data: {
            post
        }
    });
});


router.put('/unlike-post/:id', checkAuth, async(req, res, next) => {
    const postId = req.params.id;
    const {id} = req.userData;
    let post;
    try {
        post = await Post.findByIdAndUpdate(postId, {
            $pull:{likes: id}
        }, {
            new: true
        })
    } catch (error) {
        return next(new HttpError('Something went wrong', 500));
    }

    if(!post) {
        return next(new HttpError('No post with such id', 404));
    }

    res.status(200).json({
        message:'success',
        data: {
            post
        }
    });
});


router.put('/comment/:id', checkAuth, async(req, res, next) => {
    const {id} = req.userData;
    const postId = req.params.id;
    const comment= {
        text: req.body.text,
        commentedBy: id
    }

    let post;
    try {
        post = await Post.findByIdAndUpdate(postId, {
            $push:{comments:comment}
        }, {
            new: true
        }).populate('comments.commentedBy', '_  id author')
    } catch (error) {
        return next(new HttpError('Something went wrong', 500));
    }

    if(!post) {
        return next(new HttpError('No post with such id', 404));
    }

    res.status(200).json({
        message:'success',
        data: {
            post
        }
    });
});

module.exports = router;