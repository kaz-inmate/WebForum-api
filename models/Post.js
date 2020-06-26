
const mongoose = require('mongoose');
const {ObjectId}  = mongoose.Schema.Types;

var initialDate = new Date().toLocaleDateString();

const PostSchema = new mongoose.Schema({
  title: {
    type: String, 
    required:true
  },

  description: {
    type:String,
    required:true,
  },

  image: {
    type:String,
  },
  
  author: { 
    type:ObjectId,
    ref: "User"
  },
  
  creation_date: {
    type:String,
    default: () => initialDate
  },

  comments: [
    {
      text:String,
      commentedBy: {type:ObjectId, ref:"User"}
    }
  ],

  likes:[{type:ObjectId, ref:"User"}]
});



const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
