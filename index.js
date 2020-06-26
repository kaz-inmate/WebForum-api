const express = require('express');
const app = express();
const mongoose = require('mongoose');
const reglog = require('./routes/register');
const posts = require('./routes/create-post');
const likesCom = require('./routes/like-unlike');
const profile = require('./routes/user-profile');

const HttpError = require('./models/http-error');

mongoose.connect('mongodb://localhost:27017/forum-proj', 
    { useNewUrlParser: true, 
      useCreateIndex: true, 
      useFindAndModify:false }).then(success => {
        console.log('Connected to the database');
      }).catch(err => {
        console.log(err);
      });

app.use(express.json());
app.use(express.urlencoded({extended:true})); 


app.use('/api/users', reglog);
app.use('/', posts);
app.use('/posts', likesCom);
app.use('/profile', profile);

//no specified routes
app.use((req, res, next) =>{
   const error = new HttpError('There is no such route', 404);
   throw error;
});

//global error middleware
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({message: error.message || 'Something went wrong'});
});

app.listen(8000, () => {
    console.log('App running on port 8000');
});