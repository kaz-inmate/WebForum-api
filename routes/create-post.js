const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const HttpError = require('../models/http-error');
const checkAuth = require('../middleware/auth');
const imageUpload = require('../middleware/media');

router.post('/post-data', imageUpload.single('image'), checkAuth, async (req, res, next) => {
   
    const {title, description} = req.body;
    const {id} = req.userData;
    // if (!title || !description) {
    //     return next(new HttpError('Need required fields', 401));
    // }
    
    let newPost = new Post({
        title,
        description,
        author: id,
        image: (typeof req.file !== "undefined") ? 'http://localhost:8000/' + req.file.path : '',
    });

    try {
       await newPost.save();
    } catch (error) {
        return next(new HttpError('Something went wrong', 500));
    }

    res.status(201).json({
        message:'Post Created',
        post: {
            newPost
        } 
    });
});

router.get('/', async (req,res, next) => {
    let posts;
    try {
        posts = await Post.find({}).populate('author');
    } catch (error) {
        return next(new HttpError('No posts found', 400));
    }

    res.status(200).json({
        message:'Success',
        data: {
            posts
        }
    });
});


router.get('/post/:id',  async(req, res, next) => {
    const postId  = req.params.id;
    let post;
    try {
        post = await Post.findById(postId).populate('author');
    } catch (error) {
        return next(new HttpError('Not Found', 400))
    }

    if(!post) {
        return next(new HttpError('No posts found with that id.', 404));
    }
    res.status(200).json({
        message: 'success',
        data: {
            post
        }
    });
});

router.put('/edit-post/:id', checkAuth, async (req, res, next) => {
    const {id} = req.userData;
    console.log(id)
    const postId  = req.params.id;
    const {title, description} = req.body;

    let editedPost;
    try {
        editedPost = await Post.findById(postId);
    } catch (error) {
        return next(new HttpError('Something went wrong.', 500));
    }

    console.log(editedPost.author)
    if (editedPost.author != id) {
        return next(new HttpError('You are not authorized.', 400));
    }

    editedPost.title = title;
    editedPost.description = description;

    try {
        await editedPost.save();
    } catch (error) {
        return next(new HttpError('Something went wrong.', 500));
    }

    res.status(201).json({
        message:'Success',
        data: {
            editedPost
        }
    });
});


router.delete('delete-post/:id',checkAuth,  async(req, res, next) => {
    const {id} = req.userData;
    const postId  = req.params.id;

    if(postId !== id) {
        return next(new HttpError('You are not authorized.', 400));
    }

    try {
        await Post.findByIdAndDelete(postId);
    } catch (error) {
        return next(new HttpError('Something went wrong.', 400));
    }

    res.status(200).json({
        message:'Success',
        data: null
    });
});

module.exports = router;