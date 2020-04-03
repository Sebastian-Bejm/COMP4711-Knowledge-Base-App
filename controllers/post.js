let postModel = require('../models/post');

exports.getCategories = () => {
    return postModel.getCategories();
}


exports.createPost = (req,res,next) => {
    let newPost = {
        user_id: req.session.user.id,
        category_id: parseInt(req.body.category),
        heading: req.body.heading,
        details: req.body.details
     }
    postModel.createPost(newPost).then(data=>{
       console.log(data);
       req.session.user.postcount++;
       res.redirect(301, "/user/"+req.session.user.id)
    }).catch(err=>{
        console.log(err,"err creating new post");
    })
}

exports.getLatestPosts = state => {
    return postModel.getLatestPosts(state);
}


